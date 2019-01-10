const rebber = require("rebber");
const unified = require("unified");
const importPlugin = require("./plugins/import");
const getRebberOptions = require("./plugins/rebberOptions");
const mdparser = require("remark-parse");
const { ignoreOptions } = require("./plugins/ignoreOptionHeader");

function getParser() {
  return unified()
    .use(mdparser)
    .use(ignoreOptions)
    .use(importPlugin.parser)
    .use(importPlugin.resolver)
    .use(rebber, getRebberOptions());
}

module.exports = { getParser };
