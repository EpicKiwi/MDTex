const fs = require("fs");
const path = require("path");
const vfile = require("vfile");
const vfileLogger = require("./loggers/vfileLogger");
const parser = require("./parsing/mdTexParser");

const logger = require("./loggers/logger");

let indexFile = path.resolve(process.cwd(), "./index.md");
let fileContent = fs.readFileSync(indexFile, "utf8");
let indexVfile = vfile({ path: indexFile, contents: fileContent });

indexVfile.data.options = { beforeOption: true, packages: ["hello"] };

parser
  .getParser()
  .process(indexVfile)
  .then(result => {
    vfileLogger.logMessages(...result.messages);
    result.data.imports.forEach(f => vfileLogger.logMessages(...f.messages));
    fs.writeFileSync("index.tex", result.contents);
    logger.ok(`LaTeX file converted in "index.tex"`);
  })
  .catch(err => {
    err.file ? vfileLogger.logMessages(err) : logger.error(err);
  });
