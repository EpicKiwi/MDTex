const path = require("path");
const chalk = require("chalk");
const logger = require("./logger");

function logMessages(...messages) {
  if (messages.length == 0) return;
  messages.forEach(mess => {
    let severity = mess.fatal ? logger.ERROR : logger.WARNING;
    let logMess = getMessageLog(mess);
    logger.rawLog(severity, logMess);
  });
}

function getMessageLog(message) {
  let relativePath = path.relative(process.cwd(), message.file);
  const { line, column } = message;

  let fileName = relativePath;
  if (line) {
    fileName += ":" + line;
    if (column) {
      fileName += ":" + column;
    }
  } else if (column) {
    fileName += "::" + column;
  }
  let mess = `${message.message}`;

  return `${chalk.bold(fileName)} ${mess}`;
}

module.exports = { logMessages, getMessageLog };
