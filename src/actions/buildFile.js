const fs = require("fs");
const path = require("path");
const vfile = require("vfile");
const { promisify } = require("util");
const pfs = {
  mkdir: promisify(fs.mkdir),
  readFile: promisify(fs.readFile)
};

const latexOutput = require("../output/latexOutput");
const vfileLogger = require("../loggers/vfileLogger");
const parser = require("../parsing/mdTexParser");
const logger = require("../loggers/logger");

async function buildFile(inputFile, envOptions) {
  const { outputFolder, buildLatex: build } = envOptions;
  let indexFile = path.resolve(process.cwd(), inputFile);
  let texFile = path.join(
    path.dirname(indexFile),
    path.basename(indexFile, path.extname(indexFile)) + ".tex"
  );

  let fileContent = "";
  try {
    fileContent = await pfs.readFile(indexFile, "utf8");
  } catch (e) {
    logger.error(`Input file ${inputFile} not found`);
    throw e;
  }

  let indexVfile = vfile({ path: indexFile, contents: fileContent });
  indexVfile.data.options = envOptions;

  let outputPath = path.resolve(process.cwd(), outputFolder);
  logger.info(`Parsing Markdown...`);

  try {
    var result = await parser.getParser().process(indexVfile);
  } catch (err) {
    err.file ? vfileLogger.logMessages(err) : logger.error(err);
    throw err;
  }

  result.data.imports.forEach(f => vfileLogger.logMessages(...f.messages));

  const resultVfile = vfile({
    path: path.resolve(process.cwd(), texFile),
    contents: result.contents
  });

  fs.writeFileSync(resultVfile.path, resultVfile.contents);
  logger.ok(
    `LaTeX file converted in ${path.relative(process.cwd(), resultVfile.path)}`
  );

  if (!build) return;

  logger.info(`Compiling LaTeX...`);
  outputPath = result.data.options.outputFolder;
  await pfs.mkdir(outputPath, { recursive: true });

  let compilationResult = null;
  try {
    compilationResult = await latexOutput.compileLatex(texFile, outputPath);
  } catch (e) {
    if (!e.errors) {
      throw e;
    }
    compilationResult = e;
    var exitCode = 1;
  }

  compilationResult.errors.forEach(err => {
    let mess = resultVfile.message(err.message, { line: err.line });
    mess.fatal = true;
  });
  vfileLogger.logMessages(...resultVfile.messages);

  if (compilationResult.output) {
    const { path: outPath, pages } = compilationResult.output;
    logger.ok(
      `Document compiled in "${path.relative(
        process.cwd(),
        outPath
      )}" (${pages} pages)`
    );
  } else {
    logger.warning("No document produced");
  }

  if (exitCode > 0) {
    let err = new Error(`Errors in process, exit code ${exitCode}`);
    err.exitCode = exitCode;
    throw err;
  }
}

module.exports = buildFile;
