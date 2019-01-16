function unescapeLatexPlugin() {
  let oldSettings = this.data("settings") || {};
  oldSettings.escapes = {
    "#": "\\#",
    $: "$",
    "%": "\\%",
    "&": "\\&",
    "\\": "\\",
    "^": "\\textasciicircum{}",
    _: "\\_",
    "{": "{",
    "}": "}",
    "~": "\\textasciitilde{}"
  };
  this.data("settings", oldSettings);
}

module.exports = unescapeLatexPlugin;
