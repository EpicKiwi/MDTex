const yaml = require("js-yaml");
const optionsTree = require("../../options/optionsTree");
const optionsPath = require("../../options/optionsPaths");
const themeUtil = require("../../options/themeUtils");
const logger = require("../../loggers/logger");
const normalizeOptions = require("../../options/optionsUtil").normalizeOptions;
const { mergeOptions, parseOptions } = require("../../options/optionsUtil");

const OPTION_BLOC_REGEX = /^(\s*---+\s*\r?\n)([\s\S]+?)\n---+\s*\r?\n/;

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
        headerOptions = normalizeOptions(parseOptions(yamlContent));
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

    let noThemeOptions = mergeOptions({}, file.data.options, headerOptions);

    let themeName = noThemeOptions.type;
    let themeOptions = {};

    try {
      themeOptions = themeName ? themeUtil.getTheme(themeName) : {};
    } catch (e) {
      file.fail(`Can't load document type of name ${themeName} : ${e.message}`);
    }

    let finalOptions = {};

    const {
      $$globalOptions,
      $$projectOptions,
      $$argsOptions
    } = file.data.options;

    mergeOptions(
      finalOptions,
      $$globalOptions,
      themeOptions,
      $$projectOptions,
      $$argsOptions,
      headerOptions
    );

    file.data.options = finalOptions;
    if (process.env.DEBUG) {
      logger.log("Options tree : \n", finalOptions);
    }
  };
}

module.exports = optionHeaderPlugin;
