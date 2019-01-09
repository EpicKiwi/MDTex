const path = require("path");
const chalk = require("chalk");

function logMessages(vfile) {
  if (vfile.messages.length == 0) return;
  let formattedMessages = vfile.messages.map(mess => getMessageLog(mess));
  console.info(formattedMessages.join("\n"));
}

function getMessageLog(message) {
  let relativePath = path.relative(process.cwd(), message.file);
  const { line, column } = message;

  let color = message.fatal ? chalk.red : chalk.yellow;
  let bgColor = message.fatal ? chalk.bgRed : chalk.bgYellow;

  let severity = message.fatal ? "  ERROR  " : " WARNING ";
  let fileName = `${relativePath}:${line}:${column}`;
  let mess = `${message.message}`;

  return `${bgColor(severity)} ${chalk.bold(color(fileName))} ${color(mess)}`;
}

module.exports = { logMessages, getMessageLog };
