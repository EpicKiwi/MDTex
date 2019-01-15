const fs = require("fs");
const { promisify } = require("util");
const pfs = {
  readFile: promisify(fs.readFile)
};
const path = require("path");
const optionsUtils = require("./optionsUtil");
const logger = require("../loggers/logger");
const optionsPaths = require("./optionsPaths");

async function loadOptions() {
  let options = await loadOptionsFrom(optionsPaths.DEFAULT_PATH);

  try {
    let currentFolderOptions = await loadOptionsFrom(optionsPaths.CWD_PATH);
    optionsUtils.normalizeOptions(currentFolderOptions);
    options = optionsUtils.mergeOptions(options, currentFolderOptions);
  } catch (e) {
    logger.error(e.message);
    throw e;
  }

  try {
    let homeFolderOptions = await loadOptionsFrom(optionsPaths.HOME_PATH);
    optionsUtils.normalizeOptions(homeFolderOptions);
    options = optionsUtils.mergeOptions(options, homeFolderOptions);
  } catch (e) {
    logger.error(e.message);
    throw e;
  }

  optionsUtils.resolveOptionsPath(process.cwd(), options, true);
  return options;
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

module.exports = { loadOptions };
