const os = require("os");
const path = require("path");

const DEFAULT_PATH = path.resolve(__dirname, "../../defaults/options.yml");
const HOME_ROOT = `${os.homedir()}/.mdtex`;
const HOME_PATH = `${HOME_ROOT}/options.yml`;
const CWD_PATH = `${process.cwd()}/mdtex.yml`;

module.exports = { HOME_PATH, CWD_PATH, DEFAULT_PATH, HOME_ROOT };
