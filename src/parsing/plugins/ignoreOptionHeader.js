const { OPTION_BLOC_REGEX } = require("../extractYaml");

function ignoreOptions() {
  const { Parser } = this;
  const tokenizers = Parser.prototype.blockTokenizers;
  const methods = Parser.prototype.blockMethods;

  function tokenizeIgnoreOptions(eat, value, silent) {
    let match = value.match(OPTION_BLOC_REGEX);

    if (match) {
      if (silent) {
        return true;
      }

      return eat(match[0]);
    }
  }

  tokenizeIgnoreOptions.onlyAtStart = true;

  tokenizers.ignoreOptions = tokenizeIgnoreOptions;
  methods.unshift("ignoreOptions");
}

module.exports = { ignoreOptions };
