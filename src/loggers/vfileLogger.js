const path = require("path");
const chalk = require("chalk");
const logger = require("./logger");

function logMessages(vfile) {
  if (vfile.messages.length == 0) return;
  vfile.messages.forEach(mess => {
    let severity = mess.fatal ? logger.ERROR : logger.WARNING;
    let logMess = getMessageLog(mess);
    logger.rawLog(severity, logMess);
  });
}

function getMessageLog(message) {
  let relativePath = path.relative(process.cwd(), message.file);
  const { line, column } = message;

  let fileName = `${relativePath}:${line}:${column}`;
  let mess = `${message.message}`;

  return `${chalk.bold(fileName)} ${mess}`;
}

module.exports = { logMessages, getMessageLog };
