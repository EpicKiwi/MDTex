const visit = require("unist-util-visit");
const { promisify } = require("util");
const vfile = require("vfile");
const path = require("path");
const fs = require("fs");
const pfs = {
  readFile: promisify(fs.readFile)
};

function importParser() {
  const { Parser } = this;
  const tokenizers = Parser.prototype.blockTokenizers;
  const methods = Parser.prototype.blockMethods;

  function tokenizeImport(eat, value, silent) {
    let match = value.match(/^<\(([^)]+)\)>/);

    if (match) {
      if (silent) {
        return true;
      }

      return eat(match[0])({
        type: "import",
        path: match[1]
      });
    }
  }

  tokenizers.import = tokenizeImport;
  methods.splice(methods.indexOf("html"), 0, "import");
}

function importResolver() {
  return async (tree, file) => {
    if (!file.data.imports) file.data.imports = [file];
    let importNodes = [];
    visit(tree, "import", node => {
      importNodes.push(node);
    });
    await Promise.all(
      importNodes.map(async n => {
        let filePath = path.resolve(file.dirname, n.path);

        let circular = file.data.imports.find(el => el.path === filePath);

        if (!circular) {
          try {
            let fileContent = await pfs.readFile(filePath, "utf8");
            let importedVfile = vfile({
              path: filePath,
              contents: fileContent
            });
            importedVfile.data.importedFile = true;
            importedVfile.data.imports = file.data.imports;
            file.data.imports.push(importedVfile);
            n.file = await this.process(importedVfile);
          } catch (e) {
            file.message(
              `Error while importing "${n.path}": ${e.message}`,
              n.position
            );
          }
        } else {
          n.circular = true;
          file.message(
            `Circular dependancy to "${n.path}": import ignored`,
            n.position
          );
        }
      })
    );
  };
}

module.exports = {
  parser: importParser,
  resolver: importResolver
};
