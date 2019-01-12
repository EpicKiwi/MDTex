const { Command, flags } = require("@oclif/command");
const buildFile = require("../actions/buildFile");
const Watchpack = require("watchpack");
const logger = require("../loggers/logger");
const lodash = require("lodash");
const path = require("path");

class WatchCommand extends Command {
  async run() {
    const { args, flags } = this.parse(WatchCommand);
    const rebuild = lodash.debounce(() => {
      console.log("");
      logger.info("Files changed, Rebuilding...");
      this.rebuild(args.input, flags.out, !flags["no-build"]);
    }, 500);

    let indexFile = path.resolve(process.cwd(), args.input);
    let texFile = path.join(
      path.dirname(indexFile),
      path.basename(indexFile, path.extname(indexFile)) + ".tex"
    );
    let outputPath = path.resolve(process.cwd(), flags.out);
    let excludedFiles = [texFile, outputPath];

    this.wp = new Watchpack();

    this.wp.watch([], [process.cwd()]);

    this.wp.on("change", filePath => {
      let excluded = excludedFiles.find(el => filePath.startsWith(el));
      if (!excluded) {
        rebuild();
      }
    });
  }

  async rebuild(input, out, noBuild) {
    try {
      await buildFile(input, out, noBuild);
    } catch (e) {}
  }

  exit(...args) {
    this.wp.close();
    super.exit(...args);
  }
}

WatchCommand.description = `Watch the current directory and build on file change

Watch the current directory recursively on each file.
When a file of any type changes, the "build" command is executed with the given parameters.

Start writing ;)
`;

WatchCommand.flags = {
  out: flags.string({
    char: "o",
    description: "Output directory of LaTeX build result",
    default: "./out"
  }),
  "no-build": flags.boolean({
    char: "B",
    description: "Only parse markdown to LaTeX"
  })
};

WatchCommand.args = [
  {
    name: "input",
    description: "Markdown file to process",
    default: "index.md"
  }
];

module.exports = WatchCommand;
