const rebber = require("rebber");
const unified = require("unified");
const importPlugin = require("./plugins/import");
const mdparser = require("remark-parse");
const optionParser = require("./plugins/optionsHeader");
const createDocument = require("./plugins/createDocument");
const unescapeLatex = require("./plugins/unescapeLatex");
const customParts = require("./plugins/customParts");

function getParser() {
  return unified()
    .use(mdparser)
    .use(optionParser)
    .use(customParts)
    .use(importPlugin.parser)
    .use(importPlugin.resolver)
    .use(unescapeLatex)
    .use(rebber)
    .use(createDocument);
}

module.exports = { getParser };
