import { request } from "node:http";
import {
  mkdtemp,
  mkdir,
  rm,
  symlink,
  truncate,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import {
  createContactPreviewServer,
  MANUAL_STORY_ID,
  parsePreviewOptions,
} from "./serve-contact-preview.mjs";

const cleanups = [];
afterEach(async () => {
  while (cleanups.length) await cleanups.pop()();
});

async function fixture() {
  const directory = await mkdtemp(
    join(tmpdir(), "funkspace-static-contact-test-"),
  );
  cleanups.push(() => rm(directory, { recursive: true, force: true }));
  await writeFile(
    join(directory, "index.json"),
    JSON.stringify({
      entries: { [MANUAL_STORY_ID]: { id: MANUAL_STORY_ID, type: "story" } },
    }),
  );
  await writeFile(
    join(directory, "index.html"),
    "<h1>Static Contact preview</h1>",
  );
  await writeFile(join(directory, "iframe.html"), "<h1>Controlled form</h1>");
  await mkdir(join(directory, "assets"));
  await writeFile(
    join(directory, "assets", "fixture.js"),
    "export const fixture = true;",
  );
  return directory;
}

async function listening(directory) {
  const server = await createContactPreviewServer({ directory });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  cleanups.push(() => new Promise((resolve) => server.close(resolve)));
  return server.address().port;
}

function get(port, path, method = "GET") {
  return new Promise((resolve, reject) => {
    const incoming = request(
      { host: "127.0.0.1", port, path, method },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () =>
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: Buffer.concat(chunks).toString("utf8"),
          }),
        );
        response.on("error", reject);
      },
    );
    incoming.on("error", reject);
    incoming.end();
  });
}

test("requires explicit built root and restricts command-line binds", () => {
  assert.throws(() => parsePreviewOptions([]), /absolute/);
  assert.throws(() => parsePreviewOptions(["--dir", "relative"]), /absolute/);
  for (const host of [
    "127.0.0.1",
    "127.0.0.2",
    "10.2.3.4",
    "172.16.0.1",
    "172.31.255.254",
    "192.168.1.20",
  ])
    assert.equal(
      parsePreviewOptions(["--dir", "/tmp/build", "--host", host]).host,
      host,
    );
  for (const host of [
    "0.0.0.0",
    "8.8.8.8",
    "169.254.1.1",
    "172.15.0.1",
    "172.32.0.1",
    "localhost",
    "::1",
  ])
    assert.throws(
      () => parsePreviewOptions(["--dir", "/tmp/build", "--host", host]),
      /IPv4/,
    );
  for (const port of ["0", "80", "65536", "1.5", "33154junk"])
    assert.throws(
      () => parsePreviewOptions(["--dir", "/tmp/build", "--port", port]),
      /Port/,
    );
  assert.throws(
    () => parsePreviewOptions(["--dir", "/tmp/build", "--dir", "/tmp/other"]),
    /Use/,
  );
  assert.throws(
    () => parsePreviewOptions(["--dir", "/tmp/build", "--unknown", "yes"]),
    /Use/,
  );
  assert.deepEqual(parsePreviewOptions(["--dir", "/tmp/build"]), {
    directory: "/tmp/build",
    host: "127.0.0.1",
    port: 33154,
  });
});

test("refuses a build without the manual Contact story or with an oversized index", async () => {
  const directory = await fixture();
  await writeFile(join(directory, "index.json"), '{"entries":{}}');
  await assert.rejects(
    createContactPreviewServer({ directory }),
    /manual preview/,
  );
  await truncate(join(directory, "index.json"), 5 * 1024 * 1024 + 1);
  await assert.rejects(createContactPreviewServer({ directory }), /index/);
});

test("serves GET/HEAD assets with no-store, correct types and query support", async () => {
  const port = await listening(await fixture());
  const home = await get(port, "/");
  assert.equal(home.status, 200);
  assert.match(home.body, /Static Contact preview/);
  assert.equal(home.headers["cache-control"], "no-store");
  assert.equal(home.headers["x-content-type-options"], "nosniff");
  const frame = await get(
    port,
    `/iframe.html?id=${MANUAL_STORY_ID}&viewMode=story`,
  );
  assert.equal(frame.status, 200);
  assert.match(frame.body, /Controlled form/);
  const asset = await get(port, "/assets/fixture.js", "HEAD");
  assert.equal(asset.status, 200);
  assert.equal(asset.body, "");
  assert.equal(asset.headers["content-type"], "text/javascript; charset=utf-8");
  assert.ok(Number(asset.headers["content-length"]) > 0);
});

test("has no POST endpoint or API surface", async () => {
  const port = await listening(await fixture());
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
    const response = await get(port, "/api/contact", method);
    assert.equal(response.status, 405);
    assert.equal(response.headers.allow, "GET, HEAD");
    assert.equal(response.headers["cache-control"], "no-store");
  }
  for (const path of [
    "/api",
    "/api/contact",
    "/API/contact",
    "/api/fixture.js",
  ])
    assert.equal((await get(port, path)).status, 404);
});

test("rejects raw/encoded traversal, dotfiles, backslashes, NUL and malformed UTF-8", async () => {
  const port = await listening(await fixture());
  for (const path of [
    "/../index.html",
    "/assets/../index.html",
    "/%2e%2e/index.html",
    "/assets/%2e%2e%2findex.html",
    "/.env",
    "/%2eenv",
    "/assets/.private/file.js",
    "/assets%5cfixture.js",
    "/assets/%00.js",
  ])
    assert.equal((await get(port, path)).status, 403, path);
  for (const path of ["/%ZZ", "/%C3%28"])
    assert.equal((await get(port, path)).status, 400, path);
  assert.equal((await get(port, "/" + "a".repeat(4097))).status, 414);
});

test("rejects symlink file/directory escapes and a symlinked build index", async () => {
  const directory = await fixture();
  const outside = await mkdtemp(
    join(tmpdir(), "funkspace-static-contact-outside-"),
  );
  cleanups.push(() => rm(outside, { recursive: true, force: true }));
  await writeFile(
    join(outside, "synthetic-secret.txt"),
    "Synthetic fixture only",
  );
  await symlink(
    join(outside, "synthetic-secret.txt"),
    join(directory, "leak.txt"),
  );
  await symlink(outside, join(directory, "external"));
  const port = await listening(directory);
  for (const path of ["/leak.txt", "/external/synthetic-secret.txt"])
    assert.equal((await get(port, path)).status, 403);
  await rm(join(directory, "index.json"));
  await writeFile(
    join(outside, "index.json"),
    JSON.stringify({
      entries: { [MANUAL_STORY_ID]: { id: MANUAL_STORY_ID, type: "story" } },
    }),
  );
  await symlink(join(outside, "index.json"), join(directory, "index.json"));
  await assert.rejects(createContactPreviewServer({ directory }), /Forbidden/);
});

test("bounds asset size and refuses directories/unknown assets", async () => {
  const directory = await fixture();
  await writeFile(join(directory, "oversized.js"), "");
  await truncate(join(directory, "oversized.js"), 32 * 1024 * 1024 + 1);
  await mkdir(join(directory, "directory.js"));
  const port = await listening(directory);
  assert.equal((await get(port, "/oversized.js")).status, 413);
  assert.equal((await get(port, "/directory.js")).status, 404);
  assert.equal((await get(port, "/missing.js")).status, 404);
  assert.equal((await get(port, "/file.secret")).status, 404);
});
