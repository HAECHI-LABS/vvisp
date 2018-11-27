async function getPragmaVersion(filePath) {
  const parser = require('solidity-parser-antlr');
  const fs = require('fs');

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let ast = parser.parse(content);
    let version;
    parser.visit(ast, {
      PragmaDirective: function(node) {
        version = node.value;
      }
    });
    return version;
  } catch (error) {
    throw new Error(
      `${filePath} can't not parsed for extracting pragma version`
    );
  }
}

module.exports = {
  getPragmaVersion
};
