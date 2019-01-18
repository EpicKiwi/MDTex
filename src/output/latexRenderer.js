const mustache = require("mustache");

mustache.escape = value => value;

function render(template, context) {
  try {
    return mustache.render(template, context, {}, ["<<", ">>"]);
  } catch (e) {
    let pos = parseInt(e.message.replace(/^.*at (\d+).*$/, "$1"));
    let line = template.substring(0, pos).split("\n").length;
    e.line = line;
    throw e;
  }
}

module.exports = { render };
