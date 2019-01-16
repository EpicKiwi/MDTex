const lodash = require("lodash");
const yaml = require("js-yaml");
const path = require("path");

const RESOLVABLE_KEYS = ["document"];

function mergeOptions(base, ...sources) {
  return lodash.mergeWith(base, ...sources, (base, src) => {
    //Merge arrays
    if (lodash.isArray(base)) {
      return base.concat(src);
    }
  });
}

function normalizeOptions(options) {
  if (options.$$normalized) return options;
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
  options.$$normalized = true;
  return options;
}

function parseOptions(yml) {
  let ymlResult = yaml.safeLoad(yml);
  return typeof ymlResult !== "undefined" ? normalizeOptions(ymlResult) : {};
}

function resolveOptionsPath(baseFolder, options) {
  RESOLVABLE_KEYS.forEach(el => {
    if (options[el]) {
      options[el] = path.resolve(baseFolder, options[el]);
    }
  });
  return options;
}

module.exports = {
  mergeOptions,
  normalizeOptions,
  parseOptions,
  resolveOptionsPath
};
