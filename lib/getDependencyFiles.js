module.exports = async function(filePaths) {
  const tsort = require('tsort');
  const { dfs } = require('./dfs');

  const graph = tsort();
  const visitedFiles = [];

  for (const filePath of filePaths) {
    await dfs(filePath, graph, visitedFiles);
  }

  let sortedFiles;
  try {
    sortedFiles = graph.sort();
  } catch (e) {
    console.error(e.toString());
  }

  // unique array
  return [...new Set(sortedFiles.concat(filePaths))];
};
