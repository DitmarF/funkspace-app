// These attempts must be rejected by the preloader before a socket is opened.
const assert = require("node:assert/strict");
function blocked(action) {
  assert.throws(action, (error) => error.code === "FS_CI_EGRESS_DENIED");
}
blocked(() => fetch("https://example.invalid/"));
blocked(() => require("node:http").get("http://example.invalid/"));
blocked(() => require("node:https").get("https://example.invalid/"));
blocked(() => require("node:net").connect(443, "example.invalid"));
blocked(() => require("node:tls").connect(443, "example.invalid"));
blocked(() => require("node:dns").lookup("example.invalid", () => {}));
blocked(() =>
  require("node:dgram").createSocket("udp4").send("x", 53, "192.0.2.1"),
);
blocked(() => require("node:net").createServer().listen(39999, "0.0.0.0"));
blocked(() => require("node:net").createServer().listen(39999));
blocked(() =>
  require("node:net").createServer().listen({ port: 0, host: "0.0.0.0" }),
);
console.log("CI egress guard self-test passed");
