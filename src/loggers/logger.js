const chalk = require("chalk");

const logType = {
  ERROR: "ERRO",
  WARNING: "WARN",
  INFO: "INFO",
  OK: " OK ",
  DEBUG: "DEBG"
};

const defaultColor = { background: chalk.inverse, text: chalk.reset };
const statusColors = {
  [logType.ERROR]: { background: chalk.bgRed, text: chalk.red.bold },
  [logType.WARNING]: { background: chalk.bgYellow, text: chalk.yellow },
  [logType.OK]: { background: chalk.bgGreen, text: chalk.green }
};

const defaultFunction = console.log;
const statusFunctions = {
  [logType.ERROR]: process.env.DEBUG ? console.trace : console.error,
  [logType.WARNING]: process.env.DEBUG ? console.trace : console.error,
  [logType.INFO]: console.info,
  [logType.OK]: console.info
};

function rawLog(status, ...content) {
  let statusText = status || logType.DEBUG;
  let colors = statusColors[status] || defaultColor;
  let statusFunction = statusFunctions[status] || defaultFunction;

  let messages = content.map(el => {
    if (typeof el === "string") {
      return colors.text(el);
    }
    return el;
  });

  statusFunction(
    colors.background(` ${statusText.toUpperCase()} `),
    ...messages
  );
}

function log(...args) {
  rawLog(logType.DEBUG, ...args);
}

function info(...args) {
  rawLog(logType.INFO, ...args);
}

function error(...args) {
  rawLog(logType.ERROR, ...args);
}

function warning(...args) {
  rawLog(logType.WARNING, ...args);
}

function ok(...args) {
  rawLog(logType.OK, ...args);
}

module.exports = { ...logType, log, info, error, warning, ok, rawLog };
