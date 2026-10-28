// The 4.x addon's ESM preset cannot resolve its manager in Storybook 10.6.
// Its CommonJS preset provides the same hooks using Node's native resolver.
module.exports = require("storybook-design-token/preset");
