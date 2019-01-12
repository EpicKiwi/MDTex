# mdtex

Compile markdown into beautiful LaTeX document

[![Version](https://img.shields.io/npm/v/mdtex.svg)](https://npmjs.org/package/mdtex)
[![Downloads/week](https://img.shields.io/npm/dw/mdtex.svg)](https://npmjs.org/package/mdtex)
[![License](https://img.shields.io/npm/l/mdtex.svg)](https://github.com/EpicKiwi/mdtex/blob/master/package.json)

# Usage

```sh-session
$ npm install -g mdtex
$ mdtex
```

```sh-session
$ mdtex --help
Build a markdown file into a pdf

USAGE
  $ mdtex [INPUT]

ARGUMENTS
  INPUT  [default: index.md] Markdown file to process

OPTIONS
  -B, --no-build  Only parse markdown to LaTeX
  -o, --out=out   [default: ./out] Output directory of LaTeX build result
  -w, --watch     Watch this folder and rebuild when a file change

DESCRIPTION
  Start the process of build by parsing the specified file and building it with pdflatex
  It will generate a tex file with the name of md file in the current directory.
  If it exists, it will be overriten.
```

# Extra syntax

### Import statement

You can import another markdown file using the import syntax with a path relative to the current file.

```
<(./file.md)>
```
