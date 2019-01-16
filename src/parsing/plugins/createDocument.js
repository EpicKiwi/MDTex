const fs = require("fs");
const path = require("path");
const mustache = require("mustache");
const { promisify } = require("util");
const vfile = require("vfile");
const latexRenderer = require("../../output/latexRenderer");
const pfs = {
  readFile: promisify(fs.readFile)
};

function createDocument() {
  let originalCompiler = this.Compiler;

  this.Compiler = (tree, file) => {
    let content = originalCompiler(tree, file);
    if (!file.data.documentTemplate) return content;
    let templateFile = file.data.documentTemplate;
    let options = file.data.options;

    let result = "";
    mustache.escape = value => value;

    try {
      result = latexRenderer.render(templateFile.contents, {
        content,
        options
      });
    } catch (e) {
      let pos = parseInt(e.message.replace(/^.*at (\d+).*$/, "$1"));
      let line = templateFile.contents.substring(0, pos).split("\n").length;
      templateFile.fail(`Error in document template rendering : ${e.message}`, {
        line
      });
    }

    return result;
  };

  return async function documentLoader(_tree, file) {
    if (file.data.importedFile) return;
    if (!file.data.options.document) {
      file.message("No document template file specified: outputting raw LaTeX");
      return;
    }

    let docOptionPath = file.data.options.document;
    let documentPath = path.isAbsolute(file.data.options.document)
      ? docOptionPath
      : path.resolve(path.dirname(file.path), docOptionPath);
    let documentContent = "";

    try {
      documentContent = await pfs.readFile(documentPath, "utf8");
    } catch (e) {
      file.fail(`Error while loading document template file : ${e.message}`);
    }

    file.data.documentTemplate = vfile({
      path: documentPath,
      contents: documentContent
    });
  };
}

module.exports = createDocument;
