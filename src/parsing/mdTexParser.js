const rebber = require("rebber");
const unified = require("unified");
const importPlugin = require("./plugins/import");
const getRebberOptions = require("./plugins/rebberOptions");
const mdparser = require("remark-parse");
const optionParser = require("./plugins/optionsHeader");
const createDocument = require("./plugins/createDocument");

function getParser() {
  return unified()
    .use(mdparser)
    .use(optionParser)
    .use(importPlugin.parser)
    .use(importPlugin.resolver)
    .use(rebber, getRebberOptions())
    .use(createDocument);
}

module.exports = { getParser };
