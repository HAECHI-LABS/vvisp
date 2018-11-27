module.exports = function(compileOutput, filePath) {
  const path = require('path');
  return compileOutput.contracts[filePath + ':' + path.parse(filePath).name];
};
