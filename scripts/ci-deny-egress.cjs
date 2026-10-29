// Defense in depth for CI application checks. The launcher additionally runs
// every checked process in a fresh network namespace with loopback only.
const fs = require("node:fs");
const net = require("node:net");
const { syncBuiltinESMExports } = require("node:module");

const hosts = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
const log = process.env.FS_CI_EGRESS_LOG;
if (!log) throw new Error("FS_CI_EGRESS_LOG is required by the CI guard");

function deny(kind) {
  fs.appendFileSync(log, JSON.stringify({ kind, blocked: true }) + "\n");
  const error = new Error(`CI transport denied: ${kind}`);
  error.code = "FS_CI_EGRESS_DENIED";
  throw error;
}

function allow(host, kind) {
  if (!hosts.has(String(host))) deny(kind);
}

const originalFetch = globalThis.fetch;
globalThis.fetch = function (input, init) {
  const url = new URL(
    typeof input === "string" || input instanceof URL ? input : input.url,
  );
  allow(url.hostname, "fetch");
  // Never follow an allowed local response to an unreviewed external target.
  return originalFetch(input, { ...init, redirect: "error" });
};

for (const protocol of ["node:http", "node:https"]) {
  const module = require(protocol);
  const request = module.request;
  module.request = function (input, ...args) {
    const options =
      typeof input === "string" || input instanceof URL
        ? new URL(input)
        : input;
    allow(options.hostname || options.host || "localhost", protocol);
    return request.call(this, input, ...args);
  };
  module.get = function (...args) {
    const response = module.request(...args);
    response.end();
    return response;
  };
}

const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const raw = Array.isArray(args[0]) ? args[0] : args;
  const first = raw[0];
  if (typeof first === "object" && first?.path)
    return connect.apply(this, args);
  if (typeof first === "string" && first.includes("/"))
    return connect.apply(this, args);
  const options =
    typeof first === "object"
      ? first
      : { host: typeof raw[1] === "string" ? raw[1] : "localhost" };
  allow(options.host || "localhost", "socket-connect");
  return connect.apply(this, args);
};

const listen = net.Server.prototype.listen;
net.Server.prototype.listen = function (...args) {
  const first = args[0];
  if (typeof first === "object" && first?.path) return listen.apply(this, args);
  if (typeof first === "string" && first.includes("/"))
    return listen.apply(this, args);
  // Chrome launcher's port probe uses listen(0). Retain an ephemeral port,
  // but constrain that otherwise-wildcard listener to IPv4 loopback.
  if (first === 0 && (args.length === 1 || typeof args[1] === "function"))
    return listen.call(this, { port: 0, host: "127.0.0.1" }, ...args.slice(1));
  if (typeof first === "object" && first?.port === 0 && !first.host)
    return listen.call(this, { ...first, host: "127.0.0.1" }, ...args.slice(1));
  const host = typeof first === "object" ? first.host : args[1];
  // A missing host binds all interfaces; even within the namespace require an
  // explicit loopback address rather than relying on platform defaults.
  allow(host, "socket-listen");
  return listen.apply(this, args);
};

const tls = require("node:tls");
const tlsConnect = tls.connect;
tls.connect = function (...args) {
  const first = args[0];
  const options =
    typeof first === "object"
      ? first
      : { host: typeof args[1] === "string" ? args[1] : "localhost" };
  allow(options.host || options.servername || "localhost", "tls-connect");
  return tlsConnect.apply(this, args);
};

const dns = require("node:dns");
function localAddress(host, options) {
  const ipv6 = String(host).includes(":");
  const result = { address: ipv6 ? "::1" : "127.0.0.1", family: ipv6 ? 6 : 4 };
  return options?.all ? [result] : result;
}
for (const key of [
  "lookup",
  "resolve",
  "resolve4",
  "resolve6",
  "resolveAny",
  "resolveCname",
  "resolveMx",
  "resolveNaptr",
  "resolveNs",
  "resolvePtr",
  "resolveSoa",
  "resolveSrv",
  "resolveTxt",
  "reverse",
]) {
  if (typeof dns[key] === "function") {
    dns[key] = function (host, ...args) {
      if (key !== "lookup" || !hosts.has(String(host))) deny("dns");
      const callback = args.at(-1);
      const options = typeof args[0] === "object" ? args[0] : {};
      const result = localAddress(host, options);
      queueMicrotask(() =>
        options.all
          ? callback(null, result)
          : callback(null, result.address, result.family),
      );
    };
  }
  if (typeof dns.promises[key] === "function") {
    dns.promises[key] = async function (host, ...args) {
      if (key !== "lookup" || !hosts.has(String(host))) deny("dns-promises");
      return localAddress(host, args[0]);
    };
  }
}

require("node:dgram").Socket.prototype.send = function () {
  return deny("udp");
};
syncBuiltinESMExports();
