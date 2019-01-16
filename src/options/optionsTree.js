const fs = require("fs");
const { promisify } = require("util");
const pfs = {
  readFile: promisify(fs.readFile)
};
const path = require("path");
const optionsUtils = require("./optionsUtil");
const logger = require("../loggers/logger");

async function loadOptions(...paths) {
  try {
    let optionsContent = await Promise.all(
      paths.map(async el => {
        let options = {};
        if (typeof el !== "object") {
          options = await loadOptionsFrom(el);
        } else {
          options = el;
        }
        return options;
      })
    );

    let optionTree = optionsContent.reduce((acc, el) => {
      let newOptions = { ...acc };
      optionsUtils.mergeOptions(newOptions, el);
      return newOptions;
    }, {});

    return optionTree;
  } catch (e) {
    logger.error(e.message);
    throw e;
  }
}

async function loadOptionsFrom(filePath) {
  let ymlContent = "";
  try {
    ymlContent = await pfs.readFile(filePath, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") {
      return {};
    } else {
      throw e;
    }
  }
  let rawOptions = optionsUtils.parseOptions(ymlContent);
  optionsUtils.normalizeOptions(rawOptions);
  optionsUtils.resolveOptionsPath(path.dirname(filePath), rawOptions);
  return rawOptions;
}

module.exports = { loadOptions, loadOptionsFrom };
