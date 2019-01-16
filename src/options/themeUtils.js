const { promisify } = require("util");
const glob = promisify(require("glob"));
const optionPaths = require("./optionsPaths");
const lodash = require("lodash");
const optionsUtil = require("./optionsUtil");
const fs = require("fs");
const pfs = {
  readFile: promisify(fs.readFile)
};
const path = require("path");
const { loadOptionsFrom } = require("./optionsTree");

let loadedThemes = null;

function getTheme(themeName) {
  if (!loadedThemes) {
    throw new Error("Theme aren't loaded yet");
  }
  let theme = loadedThemes.find(el => el.themeInfo.name == themeName);
  if (themeName) {
    return theme;
  }
  throw new Error("Not found theme " + themeName);
}

async function loadThemes() {
  let themesFiles = await Promise.all([
    glob(`${optionPaths.DEFAULT_THEMES}/**/theme.yml`),
    glob(`${optionPaths.USER_THEMES}/**/theme.yml`)
  ]);

  themesFiles = lodash.flatten(themesFiles);

  let themesOptions = await Promise.all(
    themesFiles.map(async filePath => {
      let opts = await loadOptionsFrom(filePath);
      if (opts.themeInfo) {
        opts.themeInfo.dirname = path.dirname(filePath);
      }
      return opts;
    })
  );

  let validThemesOptions = themesOptions.filter(
    el => !!el.themeInfo && !!el.themeInfo.name
  );

  loadedThemes = validThemesOptions;
}

module.exports = { getTheme, loadThemes };
