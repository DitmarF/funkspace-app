import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, realpathSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Regression coverage for the scoped basic-ftp parser backport. The malicious
// listings run in killable child processes: a broken patch must not hang CI.
const self = fileURLToPath(import.meta.url);
const unixLine = "-rw-r--r-- 1 user group 12345 Feb 12 12:12 fixture.txt";
const dosLine = "12-05-96  05:03PM       <DIR>          myDir";
const [mode, ...args] = process.argv.slice(2);
if (mode === "--probe") {
  const [modulePath, format] = args;
  const require = createRequire(import.meta.url);
  const { parseList } = require(modulePath);
  const input =
    format === "unix"
      ? "-rw-r--r-- 1 " + "a ".repeat(64 * 1024) + "!\r\n" + unixLine
      : "x".repeat(256 * 1024) + "\r\n" + dosLine;
  process.stdout.write(
    JSON.stringify(parseList(input).map((file) => file.name)),
  );
  process.exit(0);
}

const root = resolve(mode ?? process.cwd());
const pnpm = join(root, "node_modules/.pnpm");
const entries = readdirSync(pnpm).filter((name) => name.startsWith("get-uri@"));
const owners = [];
for (const entry of entries) {
  const file = join(pnpm, entry, "node_modules/get-uri/dist/ftp.js");
  if (!existsSync(file)) continue;
  const fromOwner = createRequire(pathToFileURL(file));
  const packageFile = fromOwner.resolve("basic-ftp/package.json");
  const resolved = realpathSync(dirname(packageFile));
  const manifest = JSON.parse(readFileSync(packageFile, "utf8"));
  assert.equal(
    manifest.version,
    "5.3.1",
    `${entry} resolved an unexpected FTP version`,
  );
  owners.push({ entry, file, root: resolved });
}
assert(
  owners.some(({ entry }) => entry.startsWith("get-uri@6.")),
  "get-uri 6 owner is missing",
);
assert(
  owners.some(({ entry }) => entry.startsWith("get-uri@8.")),
  "get-uri 8 owner is missing",
);
const instances = [
  ...new Set(owners.map(({ root: packageRoot }) => packageRoot)),
];
assert(instances.length, "No owning FTP package was found");

for (const packageRoot of instances) {
  const require = createRequire(
    pathToFileURL(join(packageRoot, "package.json")),
  );
  const { parseList } = require(join(packageRoot, "dist/parseList.js"));
  const unix = require(join(packageRoot, "dist/parseListUnix.js"));
  const examples = [
    [
      "1234567 4 -rw-r--r-- 1 patrick staff 487 Feb 25 19:03 package.json",
      "package.json",
      "patrick",
      "staff",
      487,
    ],
    [
      "-rw-r--r-- 1 owner staff group 487 Feb 25 19:03 fixture.txt",
      "fixture.txt",
      "owner",
      "staff group",
      487,
    ],
    [
      "-rw-r--r--\t1\tuser\tgroup\t12345\tFeb 12\t12:12\tfixture.txt",
      "fixture.txt",
      "user",
      "group",
      12345,
    ],
  ];
  for (const [input, name, owner, group, size] of examples) {
    const [actual] = parseList(input);
    assert.deepEqual(
      [actual.name, actual.user, actual.group, actual.size],
      [name, owner, group, size],
    );
  }
  const [bounded] = parseList(
    "-rw-r--r-- 1 owner g1 g2 g3 g4 g5 g6 g7 g8 12345 Feb 12 12:12 f.txt",
  );
  assert.equal(bounded.group, "g1 g2 g3 g4 g5 g6 g7 g8");
  const [link] = parseList(
    "lrwxrwxrwx 1 neeme neeme 23 Mar 2 18:06 macros -> /home/neeme/macros",
  );
  assert.equal(link.name, "macros");
  assert.equal(link.link, "/home/neeme/macros");
  assert.equal(unix.parseLine("junk " + unixLine), undefined);
  const dos = parseList(
    dosLine + "\r\n11-14-97  04:21PM                  953 MYFILE.INI",
  );
  assert.deepEqual(
    dos.map(({ name }) => name),
    ["myDir", "MYFILE.INI"],
  );
  assert.equal(dos[0].isDirectory, true);
  assert.equal(dos[1].size, 953);
  for (const [format, expected] of [
    ["unix", "fixture.txt"],
    ["dos", "myDir"],
  ]) {
    const child = spawnSync(
      process.execPath,
      [self, "--probe", join(packageRoot, "dist/parseList.js"), format],
      {
        encoding: "utf8",
        timeout: 5000,
        maxBuffer: 64 * 1024,
      },
    );
    assert.equal(
      child.error?.code,
      undefined,
      `${format} parser failed or exceeded the five-second bound: ${child.error?.message}`,
    );
    assert.equal(
      child.status,
      0,
      `${format} parser exited ${child.status}: ${child.stderr}`,
    );
    assert.deepEqual(JSON.parse(child.stdout), [expected]);
  }
}

// Exercise each owner's FTP fallback using an injected fake Client boundary.
// No actual FTP or other network request is made.
for (const owner of owners) {
  const require = createRequire(
    pathToFileURL(join(owner.root, "package.json")),
  );
  const { Client } = require(owner.root);
  const prototype = Client.prototype;
  const names = ["access", "lastMod", "list", "downloadTo"];
  const originals = Object.fromEntries(
    names.map((name) => [name, prototype[name]]),
  );
  const events = [];
  try {
    prototype.access = async () => {
      events.push("access");
    };
    prototype.lastMod = async () => {
      events.push("lastMod");
      throw new Error("MDTM unavailable");
    };
    prototype.list = async (directory) => {
      events.push("list");
      assert.equal(directory, "/path");
      return [
        { name: "fixture.txt", modifiedAt: new Date("2026-10-28T00:00:00Z") },
      ];
    };
    prototype.downloadTo = async (stream, path) => {
      events.push("downloadTo");
      assert.equal(path, "/path/fixture.txt");
      stream.end("controlled fixture");
      return { message: "ok" };
    };
    const { ftp } = await import(pathToFileURL(owner.file).href);
    const stream = await ftp(new URL("ftp://example.invalid/path/fixture.txt"));
    let content = "";
    for await (const chunk of stream) content += chunk.toString();
    assert.equal(content, "controlled fixture");
    assert.deepEqual(events, ["access", "lastMod", "list", "downloadTo"]);
  } finally {
    for (const name of names) prototype[name] = originals[name];
  }
  console.log(`${owner.entry} resolves ${owner.root}; fake FTP fallback PASS`);
}
console.log(
  `PASS: ${instances.length} FTP package instance(s), both owner paths, valid listings and bounded malicious inputs`,
);
