const lodash = require("lodash");

function mergeOptions(base, ...sources) {
  return lodash.mergeWith(base, ...sources, (base, src) => {
    //Merge arrays
    if (lodash.isArray(base)) {
      return base.concat(src);
    }
  });
}

function normalizeOptions(options) {
  // Normalize packages //
  if (options.packages) {
    options.packages = options.packages.map(el => {
      if (typeof el === "string") {
        return { name: el };
      } else {
        let name = Object.keys(el)[0];
        let args = el[name];
        if (!lodash.isArray(args)) {
          args = [args];
        }
        return { name, args };
      }
    });
  }

  return options;
}

module.exports = { mergeOptions, normalizeOptions };
