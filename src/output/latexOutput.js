const cp = require("child_process");
const logger = require("../loggers/logger");
const path = require("path");

const ERROR_LINE_REGEX = /\n! (.+?)\.(?:.|\n)*?\nl\.(\d+)/i;
const MULTILINE_ERROR_REG = new RegExp(ERROR_LINE_REGEX, "gi");
const OUTPUT_INFO_REG = /Output written on ((?:.|\n)+) \((\d+)/;

async function compileLatex(filePath, outputPath) {
  const command = `pdflatex -interaction nonstopmode "-output-directory=${outputPath}" "${filePath}"`;
  return await new Promise((resolve, reject) => {
    const latexProcess = cp.exec(command, {
      cwd: path.dirname(filePath)
    });

    let outputContent = "";
    latexProcess.stdout.on("data", chunk => {
      outputContent += chunk;
    });

    latexProcess.on("exit", exitCode => {
      let result = {
        errors: parseOutputErrors(outputContent),
        output: isOutputProduced(outputContent)
      };
      if (exitCode > 0) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

function parseOutputErrors(output) {
  let match = output.match(MULTILINE_ERROR_REG);
  if (!match) {
    return [];
  }
  return match.map(err => {
    let match = err.match(ERROR_LINE_REGEX);
    return {
      message: match[1],
      line: parseInt(match[2])
    };
  });
}

function isOutputProduced(logs) {
  let match = logs.match(OUTPUT_INFO_REG);
  if (!match) return false;

  return {
    path: match[1].replace("\n", "").trim(),
    pages: parseInt(match[2])
  };
}

module.exports = { compileLatex };
