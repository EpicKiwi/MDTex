const mustache = require("mustache");

function render(template, context) {
  return mustache.render(template, context, {}, ["<<", ">>"]);
}

module.exports = { render };
