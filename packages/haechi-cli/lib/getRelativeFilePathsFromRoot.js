module.exports = async function(rootFilePath, filePaths) {
  const path = require('path');
  return filePaths.map(f => {
    return path.relative(rootFilePath, path.resolve(f));
  });
};
