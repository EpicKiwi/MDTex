const fs = require("fs");
const path = require("path");
const vfile = require("vfile");
const vfileLogger = require("./loggers/vfileLogger");
const parser = require("./parsing/mdTexParser");
const { promisify } = require("util");
const pfs = {
  mkdir: promisify(fs.mkdir)
};
const latexOutput = require("./output/latexOutput");

const logger = require("./loggers/logger");

async function run() {
  let indexFile = path.resolve(process.cwd(), "./index.md");
  let fileContent = fs.readFileSync(indexFile, "utf8");
  let indexVfile = vfile({ path: indexFile, contents: fileContent });

  let outputPath = path.resolve(process.cwd(), "./out");
  logger.info(`Parsing Markdown...`);

  try {
    await pfs.mkdir(outputPath, { recursive: true });
    var result = await parser.getParser().process(indexVfile);
  } catch (err) {
    err.file ? vfileLogger.logMessages(err) : logger.error(err);
    process.exit(1);
  }

  vfileLogger.logMessages(...result.messages);
  result.data.imports.forEach(f => vfileLogger.logMessages(...f.messages));

  const resultVfile = vfile({
    path: path.resolve(process.cwd(), "index.tex"),
    contents: result.contents
  });

  fs.writeFileSync(resultVfile.path, resultVfile.contents);
  logger.ok(
    `LaTeX file converted in ${path.relative(process.cwd(), resultVfile.path)}`
  );
  logger.info(`Compiling LaTeX...`);

  var compilationResult = null;
  try {
    compilationResult = await latexOutput.compileLatex("index.tex", outputPath);
  } catch (e) {
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
    process.exit(exitCode);
  }
}

run();
