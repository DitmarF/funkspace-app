// Only the isolated particle fixture's Next dev server loads this preload.
// Next's dev overlay fetches npm dist-tags at startup even in offline CI.
// Return its normal unknown-version fallback without making a network request.
const path = require("node:path");
const nextReloader = require.resolve(
  "next/dist/server/dev/hot-reloader-webpack",
  {
    paths: [path.join(__dirname, "../frontend")],
  },
);
const guardedFetch = globalThis.fetch;
const registryLookup = "https://registry.npmjs.org/-/package/next/dist-tags";

globalThis.fetch = function (input, init) {
  const caller = new Error().stack?.split("\n")[2] || "";
  const match = /^\s*at getVersionInfo \((.+):\d+:\d+\)$/.exec(caller);
  if (
    arguments.length === 1 &&
    input === registryLookup &&
    match?.[1] === nextReloader
  ) {
    return Promise.resolve(new Response(null, { status: 503 }));
  }
  return guardedFetch.apply(this, arguments);
};
