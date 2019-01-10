const yaml = require("js-yaml");

const OPTION_BLOC_REGEX = /^(\s*---+\s*\r?\n)([\s\S]+)\n---+\s*\r?\n/;

function extract(vfile, ignoreError) {
  let blockMatch = vfile.contents.match(OPTION_BLOC_REGEX);
  vfile.data.options = {};

  if (!blockMatch) {
    return vfile;
  }

  let yamlOffset = blockMatch[1].split("\n").length;
  yamlContent = blockMatch[2];

  try {
    let yamlResult = yaml.safeLoad(yamlContent);
    vfile.data.options = yamlResult;
  } catch (e) {
    vfile.fail(`Options parsing error : ${e.reason}`, {
      line: e.mark.line + yamlOffset,
      column: e.mark.column
    });
  }

  return vfile;
}

module.exports = { extract, OPTION_BLOC_REGEX };
