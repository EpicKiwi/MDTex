const fs = require("fs");
const logger = require("../loggers/logger");
const optionsPaths = require("./optionsPaths");
const { promisify } = require("util");
const pfs = {
  access: promisify(fs.access),
  mkdir: promisify(fs.mkdir),
  writeFile: promisify(fs.writeFile)
};

async function checkSetup() {
  try {
    await pfs.access(optionsPaths.HOME_ROOT);
  } catch (e) {
    if (e.code === "ENOENT") {
      await setup();
    } else {
      logger.error(e.message);
      throw e;
    }
  }
}

async function setup() {
  try {
    await pfs.mkdir(optionsPaths.HOME_ROOT, { recursive: true });
    await pfs.mkdir(optionsPaths.USER_THEMES, { recursive: true });
    await pfs.writeFile(optionsPaths.HOME_PATH, "");
  } catch (e) {
    logger.error(e.message);
    throw e;
  }
}

module.exports = { checkSetup, setup };
