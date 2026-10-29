const assert = require("node:assert/strict");
const net = require("node:net");

async function probe(options) {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    // Test both numeric and options-based hostless ephemeral calls. The guard
    // must bind each to loopback while preserving its callback and options.
    server.listen(options, () => {
      try {
        assert.equal(server.address().address, "127.0.0.1");
        assert.ok(server.address().port > 0);
        server.close((error) => (error ? reject(error) : resolve()));
      } catch (error) {
        server.close(() => reject(error));
      }
    });
  });
}

Promise.resolve()
  .then(() => probe(0))
  .then(() => probe({ port: 0, exclusive: true }))
  .then(() => console.log("CI loopback port-probe self-test passed"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
