const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const guard = path.join(__dirname, "ci-deny-egress.cjs");
const fixture = path.join(__dirname, "ci-fixture-next-offline.cjs");

function run(code) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "fs-next-offline-"));
  const log = path.join(temp, "blocked.jsonl");
  try {
    const result = spawnSync(
      process.execPath,
      ["--require", guard, "--require", fixture, "-e", code],
      {
        cwd: root,
        encoding: "utf8",
        env: { PATH: process.env.PATH, FS_CI_EGRESS_LOG: log },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    return fs.existsSync(log)
      ? fs.readFileSync(log, "utf8").trim().split("\n").map(JSON.parse)
      : [];
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

test("Next dev version lookup uses an offline unknown-version response", () => {
  const blocked = run(`
    const assert = require("node:assert/strict");
    const { getVersionInfo } = require("./frontend/node_modules/next/dist/server/dev/hot-reloader-webpack");
    getVersionInfo().then(info => assert.equal(info.staleness, "unknown"))
      .catch(error => { console.error(error); process.exitCode = 1; });
  `);
  assert.deepEqual(blocked, []);
});

test("other callers and requests still hit the unmodified egress guard", () => {
  const blocked = run(`
    const assert = require("node:assert/strict");
    const url = "https://registry.npmjs.org/-/package/next/dist-tags";
    for (const action of [
      () => fetch(url),
      () => fetch(url, { method: "POST" }),
      () => fetch(url + "?other=1"),
      () => fetch("https://example.invalid/"),
      () => fetch(new Request(url)),
    ]) assert.throws(action, { code: "FS_CI_EGRESS_DENIED" });
    require("./scripts/ci-egress-selftest.cjs");
  `);
  assert.equal(blocked.filter((event) => event.kind === "fetch").length, 6);
  assert.ok(blocked.every((event) => event.blocked));
});
