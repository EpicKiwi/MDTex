function getOptions() {
  return {
    escapes: {
      // Reset default escapes to allow LaTeX commands inside MD
      "#": "\\#",
      $: "\\$",
      "%": "\\%",
      "&": "\\&",
      "\\": "\\",
      "^": "\\textasciicircum{}",
      _: "\\_",
      "{": "{",
      "}": "}",
      "~": "\\textasciitilde{}"
    },
    overrides: {
      import: (_o, node) => {
        if (node.file && node.file.contents) {
          return `%% Imported ${node.path}\n\n${node.file.contents}`;
        } else {
          return `%% Ignored import ${node.path}`;
        }
      }
    }
  };
}

module.exports = getOptions;
