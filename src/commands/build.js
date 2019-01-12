const { Command, flags } = require("@oclif/command");
const buildFile = require("../actions/buildFile");

class BuildCommand extends Command {
  async run() {
    const { args, flags } = this.parse(BuildCommand);
    try {
      await buildFile(args.input, flags.out, !flags["no-build"]);
    } catch (e) {
      if (e.exitCode) {
        this.exit(e.exitCode);
      } else {
        this.exit(1);
      }
    }
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
    description: "Output directory of LaTeX build result"
  }),
  "no-build": flags.boolean({
    char: "B",
    description: "Only parse markdown to LaTeX"
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
