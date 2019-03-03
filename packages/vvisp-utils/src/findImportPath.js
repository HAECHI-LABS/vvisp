module.exports = function(filePath) {
  const fs = require('fs');
  const path = require('path');
  const findNodeModules = require('find-node-modules');

  // find recursively to find .sol file
  if (fs.existsSync(filePath)) {
    return filePath;
  } else {
    // find .sol file from node_modules
    const nodeModules = findNodeModules();
    for (let nodeModule of nodeModules) {
      const modulePath = path.join(nodeModule, filePath);
      if (fs.existsSync(modulePath)) return modulePath;
    }
    throw new Error(`Module path, ${filePath} is not found`);
  }
};
