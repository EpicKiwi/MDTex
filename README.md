# mdtex

Compile markdown into beautiful LaTeX document

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mdtex.svg)](https://npmjs.org/package/mdtex)
[![Downloads/week](https://img.shields.io/npm/dw/mdtex.svg)](https://npmjs.org/package/mdtex)
[![License](https://img.shields.io/npm/l/mdtex.svg)](https://github.com/EpicKiwi/mdtex/blob/master/package.json)

<!-- toc -->
* [mdtex](#mdtex)
* [Usage](#usage)
* [Commands](#commands)
* [Extra syntax](#extra-syntax)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g mdtex
$ mdtex COMMAND
running command...
$ mdtex (-v|--version|version)
mdtex/1.0.0 linux-x64 node-v11.6.0
$ mdtex --help [COMMAND]
USAGE
  $ mdtex COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`mdtex hello`](#mdtex-hello)
* [`mdtex help [COMMAND]`](#mdtex-help-command)

## `mdtex hello`

Describe the command here

```
USAGE
  $ mdtex hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/EpicKiwi/mdtex/blob/v1.0.0/src/commands/hello.js)_

## `mdtex help [COMMAND]`

display help for mdtex

```
USAGE
  $ mdtex help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_
<!-- commandsstop -->

# Extra syntax

### Import statement

You can import another markdown file using the import syntax with a path relative to the current file.

```
<(./file.md)>
```
