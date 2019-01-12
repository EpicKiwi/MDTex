# mdtex

Compile markdown into beautiful LaTeX document

[![Version](https://img.shields.io/npm/v/mdtex.svg)](https://npmjs.org/package/mdtex)
[![Downloads/week](https://img.shields.io/npm/dw/mdtex.svg)](https://npmjs.org/package/mdtex)
[![License](https://img.shields.io/npm/l/mdtex.svg)](https://github.com/EpicKiwi/mdtex/blob/master/package.json)

# Usage

```sh-session
$ npm install -g mdtex
$ mdtex build
```

# Commands

- `mdtex help [COMMAND]`: Give help about commands
- `mdtex build [INPUT]`: Build a markdown document into a pdf file
- `mdtex watch [INPUT]`: Watch the current directory and build if a file change

# Extra syntax

### Import statement

You can import another markdown file using the import syntax with a path relative to the current file.

```
<(./file.md)>
```
