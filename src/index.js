const { Command, flags } = require("@oclif/command");
const buildFile = require("./actions/buildFile");
const path = require("path");
const lodash = require("lodash");
const Watchpack = require("watchpack");
const logger = require("./loggers/logger");

class BuildCommand extends Command {
  async run() {
    const { flags } = this.parse(BuildCommand);
    if (flags.watch) {
      await this.watch();
    } else {
      try {
        await this.build();
      } catch (e) {
        this.exit(e.exitCode);
      }
    }
  }

  async watch() {
    const { args, flags } = this.parse(BuildCommand);
    const rebuild = lodash.debounce(async () => {
      console.log("");
      logger.info("Files changed, Rebuilding...");
      try {
        await this.build();
      } catch (e) {
        //Ignore
      }
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

  async build() {
    const { args, flags } = this.parse(BuildCommand);
    await buildFile(args.input, flags.out, !flags["no-build"]);
  }

  exit(...args) {
    if (this.wp) {
      this.wp.close();
    }
    return super.exit(...args);
  }
}

BuildCommand.description = `Build a markdown file into a pdf

Start the process of build by parsing the specified file and building it with pdflatex
It will generate a tex file with the name of md file in the current directory.
If it exists, it will be overriten.
`;

BuildCommand.flags = {
  out: flags.string({
    char: "o",
    description: "Output directory of LaTeX build result",
    default: "./out"
  }),
  "no-build": flags.boolean({
    char: "B",
    description: "Only parse markdown to LaTeX"
  }),
  watch: flags.boolean({
    char: "w",
    description: "Watch this folder and rebuild when a file change"
  })
};

BuildCommand.args = [
  {
    name: "input",
    description: "Markdown file to process",
    default: "index.md"
  }
];

module.exports = BuildCommand;
