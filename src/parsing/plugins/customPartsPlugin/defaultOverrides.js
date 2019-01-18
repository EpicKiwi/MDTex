const escaper = require("../../../../node_modules/rebber/src/escaper.js");

module.exports = {
  heading1: val => `\\part{${val}}\n`,
  heading2: val => `\\chapter{${val}}\n`,
  heading3: val => `\\section{${val}}\n`,
  heading4: val => `\\subsection{${val}}\n`,
  heading5: val => `\\subsubsection{${val}}\n`,
  heading6: val => `\\paragraph{${val}}\n`,
  heading7: val => `\\subparagaph{${val}}\n`,
  image: node => `\\includegraphics{${node.url}}`,
  list: (innerText, isOrdered) => {
    if (isOrdered) {
      return `\\begin{enumerate}\n${innerText}\\end{enumerate}\n`;
    } else {
      return `\\begin{itemize}\n${innerText}\\end{itemize}\n`;
    }
  },
  listItem: innerText => `\\item ${innerText}\n`,
  thematicBreak: () => "\\horizontalLine\n\n",
  code: (content, lang) => {
    if (!lang) lang = "text";
    let param = "";
    if (lang.indexOf("hl_lines=") > -1) {
      let lines = lang.split("hl_lines=")[1].trim();
      if (
        (lines.startsWith('"') && lines.endsWith('"')) ||
        (lines.startsWith("'") && lines.endsWith("'"))
      ) {
        lines = lines.slice(1, -1).trim();
      }
      param += `[][${lines}]`;
    }
    lang = lang.split(" ")[0];
    return `\\begin{CodeBlock}${param}{${lang}}\n${content}\n\\end{CodeBlock}\n\n`;
  },
  inlineCode: (ctx, node) => {
    return `\\texttt{${escaper(node.value)}}`;
  },
  blockquote: innerText =>
    `\\begin{quotation}\n${innerText}\n\\end{quotation}\n\n`
};
