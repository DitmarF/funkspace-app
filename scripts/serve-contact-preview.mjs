import { createServer } from "node:http";
import { constants } from "node:fs";
import { lstat, open, realpath, stat } from "node:fs/promises";
import { isIP } from "node:net";
import { extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { pipeline } from "node:stream/promises";
import { pathToFileURL } from "node:url";

export const MANUAL_STORY_ID = "contact-manual-preview--manual";
const MAX_ASSET_BYTES = 32 * 1024 * 1024;
const MAX_INDEX_BYTES = 5 * 1024 * 1024;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
  ".wasm": "application/wasm",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

function localHost(host) {
  if (isIP(host) !== 4) return false;
  const [a, b] = host.split(".").map(Number);
  return (
    a === 127 ||
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

/** Only an explicit static build and an IPv4 loopback/private bind are accepted. */
export function parsePreviewOptions(args) {
  const options = { host: "127.0.0.1", port: 33154 };
  const seen = new Set();
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    if (
      !["--dir", "--host", "--port"].includes(flag) ||
      !value ||
      seen.has(flag)
    )
      throw new Error(
        "Use --dir /absolute/Storybook/build [--host private-IPv4] [--port 1024-65535].",
      );
    seen.add(flag);
    if (flag === "--dir") options.directory = value;
    if (flag === "--host") options.host = value;
    if (flag === "--port") {
      if (!/^\d+$/.test(value))
        throw new Error("Port must be an integer from 1024 to 65535.");
      options.port = Number(value);
    }
  }
  if (!options.directory || !isAbsolute(options.directory))
    throw new Error("An absolute built Storybook directory is required.");
  if (!localHost(options.host))
    throw new Error(
      "Host must be an IPv4 loopback or RFC1918 private address.",
    );
  if (
    !Number.isInteger(options.port) ||
    options.port < 1024 ||
    options.port > 65535
  )
    throw new Error("Port must be an integer from 1024 to 65535.");
  return options;
}

function contained(root, target) {
  const path = relative(root, target);
  return path !== ".." && !path.startsWith(".." + sep) && !isAbsolute(path);
}

async function checkedAsset(root, segments) {
  let current = root;
  for (const segment of segments) {
    current = join(current, segment);
    if ((await lstat(current)).isSymbolicLink())
      throw Object.assign(new Error("Forbidden path"), { code: "FORBIDDEN" });
  }
  const target = await realpath(current);
  if (!contained(root, target))
    throw Object.assign(new Error("Forbidden path"), { code: "FORBIDDEN" });
  return target;
}

async function validateBuild(directory) {
  if (!directory || !isAbsolute(directory))
    throw new Error("An absolute built Storybook directory is required.");
  const root = await realpath(directory);
  if (!(await stat(root)).isDirectory())
    throw new Error("Storybook build must be a directory.");
  const indexPath = await checkedAsset(root, ["index.json"]);
  const file = await open(indexPath, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const metadata = await file.stat();
    if (!metadata.isFile() || metadata.size > MAX_INDEX_BYTES)
      throw new Error("Invalid Storybook index.");
    const index = JSON.parse(await file.readFile("utf8"));
    const entry = index?.entries?.[MANUAL_STORY_ID];
    if (entry?.id !== MANUAL_STORY_ID || entry.type !== "story")
      throw new Error(
        "Storybook build does not contain the Contact manual preview.",
      );
  } finally {
    await file.close();
  }
  return root;
}

/** Static-only HTTP surface: no application server, providers, credentials or requests logs. */
export async function createContactPreviewServer({ directory }) {
  const root = await validateBuild(directory);
  const server = createServer(
    { maxHeaderSize: 8192, headersTimeout: 10000, requestTimeout: 10000 },
    (request, response) => {
      response.setHeader("Cache-Control", "no-store");
      response.setHeader("X-Content-Type-Options", "nosniff");
      response.setHeader("Referrer-Policy", "no-referrer");
      const reject = (status, message) => {
        response.statusCode = status;
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.setHeader("Connection", "close");
        response.end(message);
      };
      const serve = async () => {
        if (request.method !== "GET" && request.method !== "HEAD") {
          response.setHeader("Allow", "GET, HEAD");
          reject(405, "Static preview accepts GET and HEAD only.");
          return;
        }
        const raw = request.url ?? "";
        if (raw.length > 4096) {
          reject(414, "Request target too long.");
          return;
        }
        if (!raw.startsWith("/")) {
          reject(400, "Invalid request target.");
          return;
        }
        let pathname;
        try {
          pathname = decodeURIComponent(raw.split("?")[0]);
        } catch {
          reject(400, "Invalid request target.");
          return;
        }
        const segments = pathname.split("/").filter(Boolean);
        if (
          pathname.includes("\\") ||
          pathname.includes("\0") ||
          segments.some((part) => part.startsWith("."))
        ) {
          reject(403, "Forbidden path.");
          return;
        }
        if (segments[0]?.toLowerCase() === "api") {
          reject(404, "No API exists in this static preview.");
          return;
        }
        if (!segments.length) segments.push("index.html");
        const contentType = mime[extname(segments.at(-1)).toLowerCase()];
        if (!contentType) {
          reject(404, "Asset not found.");
          return;
        }
        let file;
        try {
          const target = await checkedAsset(root, segments);
          file = await open(target, constants.O_RDONLY | constants.O_NOFOLLOW);
          const metadata = await file.stat();
          if (!metadata.isFile() || metadata.size > MAX_ASSET_BYTES) {
            reject(
              metadata.size > MAX_ASSET_BYTES ? 413 : 404,
              "Asset unavailable.",
            );
            return;
          }
          response.setHeader("Content-Type", contentType);
          response.setHeader("Content-Length", metadata.size);
          if (request.method === "HEAD") {
            response.end();
            return;
          }
          await pipeline(file.createReadStream({ autoClose: false }), response);
        } catch (error) {
          if (response.headersSent) response.destroy();
          else
            reject(
              error.code === "FORBIDDEN" || error.code === "ELOOP" ? 403 : 404,
              "Asset unavailable.",
            );
        } finally {
          await file?.close().catch(() => {});
        }
      };
      void serve().catch(() => {
        if (response.headersSent) response.destroy();
        else reject(500, "Preview unavailable.");
      });
    },
  );
  server.maxConnections = 32;
  server.maxRequestsPerSocket = 100;
  server.keepAliveTimeout = 5000;
  return server;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const options = parsePreviewOptions(process.argv.slice(2));
    const server = await createContactPreviewServer(options);
    server.on("error", (error) => {
      console.error(
        "Unable to start static Contact preview:",
        error.code ?? "server_error",
      );
      process.exitCode = 1;
    });
    server.listen(options.port, options.host, () => {
      const origin = `http://${options.host}:${options.port}`;
      console.log(origin);
      console.log(`${origin}/iframe.html?id=${MANUAL_STORY_ID}&viewMode=story`);
    });
    const stop = () => server.close(() => process.exit());
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
