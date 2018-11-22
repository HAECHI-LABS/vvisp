module.exports = function(filePath) {
  const fs = require('fs');
  const PRAGAMA_SOLIDITY_VERSION_REGEX = /^\s*pragma\ssolidity\s+(.*?)\s*;/;
  const IMPORT_SOLIDITY_REGEX = /^\s*import(\s+).*$/gm;

  return fs
    .readFileSync(filePath, 'utf8')
    .replace(PRAGAMA_SOLIDITY_VERSION_REGEX, '')
    .replace(IMPORT_SOLIDITY_REGEX, '')
    .trim();
};
