const vfile = require("vfile");
const fs = require("fs");
const { promisify } = require("util");
const pfs = {
  readFile: promisify(fs.readFile)
};
const path = require("path");
const latexRenderer = require("../../../output/latexRenderer");
const defaultOverrides = require("./defaultOverrides");
const escaper = require("../../../../node_modules/rebber/src/escaper.js");

function customParts() {
  let availableOverrides = {};

  function createOverride(name, getContext) {
    return (...args) => {
      const file = availableOverrides[name];
      if (file) {
        let context = getContext ? getContext(...args) : {};
        try {
          return latexRenderer.render(file.contents, {
            ...context,
            options: file.data.options,
            dirname: path.dirname(file.path)
          });
        } catch (e) {
          file.fail(`Error while rendering override : ${e.message}`, {
            line: e.line
          });
        }
      }
      const defaultFunction = defaultOverrides[name];
      return defaultFunction(...args);
    };
  }

  let oldSettings = this.data("settings") || {};
  oldSettings.overrides = oldSettings.overrides || {};

  oldSettings.headings = [
    createOverride("heading1", content => {
      return { content, depth: 1 };
    }),
    createOverride("heading2", content => {
      return { content, depth: 2 };
    }),
    createOverride("heading3", content => {
      return { content, depth: 3 };
    }),
    createOverride("heading4", content => {
      return { content, depth: 4 };
    }),
    createOverride("heading5", content => {
      return { content, depth: 5 };
    }),
    createOverride("heading6", content => {
      return { content, depth: 6 };
    }),
    createOverride("heading7", content => {
      return { content, depth: 7 };
    })
  ];
  oldSettings.image = {
    image: createOverride("image", node => {
      return { url: node.url, title: node.alt };
    })
  };
  oldSettings.list = createOverride("list", (content, isOrdered) => {
    return { content, isOrdered };
  });
  oldSettings.listItem = createOverride("listItem", content => {
    return { content };
  });
  oldSettings.thematicBreak = createOverride("thematicBreak");
  oldSettings.code = createOverride("code", (content, language) => {
    return { content, language };
  });
  oldSettings.overrides.inlineCode = createOverride(
    "inlineCode",
    (ctx, node) => {
      return { content: escaper(node.value) };
    }
  );
  oldSettings.blockquote = createOverride("blockquote", content => {
    return { content };
  });

  this.data("settings", oldSettings);

  return async function loadTemplates(tree, file) {
    if (!file.data.options) return;
    const { overrides } = file.data.options;

    if (overrides) {
      await Promise.all(
        Object.keys(overrides).map(async key => {
          let templatePath = overrides[key];
          let templateFile = vfile({ path: templatePath });
          try {
            templateFile.data.options = file.data.options;
            templateFile.contents = await pfs.readFile(templatePath, "utf8");
            availableOverrides[key] = templateFile;
          } catch (e) {
            //file.fail(`Error while loading override : ${e.message}`);
          }
        })
      );
    }
  };
}

module.exports = customParts;
