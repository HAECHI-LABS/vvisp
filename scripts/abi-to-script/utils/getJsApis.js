module.exports = function(dirPath) {
  const fs = require('fs-extra');
  const path = require('path');

  const contents = fs.readdirSync(dirPath);
  const apis = { apis: [] };

  for (let i = 0; i < contents.length; i++) {
    const parses = path.parse(contents[i]);
    if (parses.ext === '.js') {
      apis.apis.push({ name: parses.name });
    }
  }

  return apis;
};
