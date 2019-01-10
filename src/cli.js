const fs = require("fs");
const path = require("path");
const vfile = require("vfile");
const vfileLogger = require("./loggers/vfileLogger");
const parser = require("./parsing/mdTexParser");
const yamlExtractor = require("./parsing/extractYaml");

const logger = require("./loggers/logger");

let indexFile = path.resolve(process.cwd(), "./index.md");
let fileContent = fs.readFileSync(indexFile, "utf8");
let indexVfile = vfile({ path: indexFile, contents: fileContent });

try {
  yamlExtractor.extract(indexVfile, true);
} catch (e) {
  vfileLogger.logMessages(indexVfile);
  process.exit(1);
}

logger.log(indexVfile.data.options);

parser
  .getParser()
  .process(indexVfile)
  .then(result => {
    vfileLogger.logMessages(result);
    result.data.imports.forEach(f => vfileLogger.logMessages(f));
    fs.writeFileSync("index.tex", result.contents);
    logger.ok(`LaTeX file converted in "index.tex"`);
  })
  .catch(err => logger.error(err));
