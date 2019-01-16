const lodash = require("lodash");

function getOriginal(type) {
  return require(__dirname +
    "/../../../node_modules/rebber/dist/types/" +
    type);
}

let originals = {};
originals.blockquote = getOriginal("blockquote");
originals.break = getOriginal("break");
originals.code = getOriginal("code");
originals.definition = getOriginal("definition");
originals.delete = getOriginal("delete");
originals.emphasis = getOriginal("emphasis");
originals.footnote = getOriginal("footnote");
originals.footnoteDefinition = getOriginal("footnoteDefinition");
originals.footnoteReference = getOriginal("footnoteReference");
originals.heading = getOriginal("heading");
originals.html = getOriginal("html");
originals.image = getOriginal("image");
originals.inlineCode = getOriginal("inlinecode");
originals.link = getOriginal("link");
originals.linkReference = getOriginal("linkReference");
originals.list = getOriginal("list");
originals.listItem = getOriginal("listItem");
originals.paragraph = getOriginal("paragraph");
originals.strong = getOriginal("strong");
originals.table = getOriginal("table");
originals.thematicBreak = getOriginal("thematic-break");

function createOverride() {}

function customParts() {
  let oldSettings = this.data("settings") || {};
  oldSettings.overrides = oldSettings.overrides || {};

  this.data("settings", oldSettings);
}

module.exports = customParts;
