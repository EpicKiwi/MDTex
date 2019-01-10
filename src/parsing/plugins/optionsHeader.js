const yaml = require("js-yaml");
const { mergeOptions, normalizeOptions } = require("../../options/optionsUtil");

const OPTION_BLOC_REGEX = /^(\s*---+\s*\r?\n)([\s\S]+)\n---+\s*\r?\n/;

function optionHeaderPlugin() {
  let headerOptions = {};
  let headerError = null;

  const { Parser } = this;
  const tokenizers = Parser.prototype.blockTokenizers;
  const methods = Parser.prototype.blockMethods;

  function tokenizeIgnoreOptions(eat, value, silent) {
    let match = value.match(OPTION_BLOC_REGEX);

    if (match) {
      if (silent) {
        return true;
      }

      let yamlOffset = match[1].split("\n").length;
      yamlContent = match[2];

      try {
        let yamlResult = yaml.safeLoad(yamlContent);
        headerOptions = yamlResult;
      } catch (e) {
        headerError = {
          error: e,
          position: {
            line: e.mark.line + yamlOffset
          }
        };
      }

      return eat(match[0]);
    }
  }
  tokenizeIgnoreOptions.onlyAtStart = true;
  tokenizers.ignoreOptions = tokenizeIgnoreOptions;
  methods.unshift("ignoreOptions");

  return (_tree, file) => {
    if (file.data.importedFile) return;
    if (headerError) {
      file.fail(headerError.error.reason, headerError.position);
    }
    if (file.data.options) {
      mergeOptions(file.data.options, headerOptions);
    } else {
      file.data.options = headerOptions;
    }
    normalizeOptions(file.data.options);
  };
}

module.exports = optionHeaderPlugin;
