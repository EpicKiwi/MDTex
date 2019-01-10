const fs = require("fs");
const path = require("path");
const mdparser = require("remark-parse");
const vfile = require("vfile");
const rebber = require("rebber");
const unified = require("unified");
const importPlugin = require("./transformers/import");
const getRebberOptions = require("./rebberOptions");
const vfileLogger = require("./loggers/vfileLogger");

const logger = require("./loggers/logger");

let indexFile = path.resolve(process.cwd(), "./index.md");
let fileContent = fs.readFileSync(indexFile, "utf8");
let indexVfile = vfile({ path: indexFile, contents: fileContent });

let result = unified()
  .use(mdparser)
  .use(importPlugin.parser)
  .use(importPlugin.resolver)
  .use(rebber, getRebberOptions())
  .process(indexVfile)
  .then(result => {
    vfileLogger.logMessages(result);
    result.data.imports.forEach(f => vfileLogger.logMessages(f));
    fs.writeFileSync("index.tex", result.contents);
    logger.ok(`LaTeX file compiled in "index.tex"`);
  })
  .catch(err => console.error(err));
