async function dfs(filePath, graph, visitedFiles) {
  const findImportPath = require('./findImportPath');
  const fs = require('fs');
  filePath = findImportPath(filePath);

  visitedFiles.push(filePath);

  const content = fs.readFileSync(filePath, 'utf8');
  const dependencies = getDependencies(filePath, content);

  for (const dependency of dependencies) {
    graph.add(dependency, filePath);

    if (!visitedFiles.includes(dependency)) {
      await dfs(dependency, graph, visitedFiles);
    }
  }
}

function getDependencies(filePath, content) {
  const findImportPath = require('./findImportPath');
  const parser = require('solidity-parser-antlr');
  const path = require('path');

  try {
    let imports = [];
    let ast = parser.parse(content);
    parser.visit(ast, {
      ImportDirective: function(node) {
        let importFilePath;
        if (node.path.startsWith('./') || node.path.startsWith('../')) {
          importFilePath = path.join(path.dirname(filePath), node.path);
        } else {
          importFilePath = findImportPath(node.path);
        }
        imports.push(importFilePath);
      }
    });
    return imports;
  } catch (error) {
    throw new Error(`${filePath} can't not parsed for extracting imports`);
  }
}

module.exports = {
  dfs
};
