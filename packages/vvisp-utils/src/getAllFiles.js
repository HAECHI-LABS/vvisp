module.exports = function(_dir, _filter) {
  const fs = require('fs');
  const path = require('path');

  return recursive([], _dir);

  function recursive(fileArr, dir) {
    const files = fs.readdirSync(dir);

    for (let i = 0; i < files.length; i++) {
      const elementPath = path.join(dir, files[i]);

      if (fs.lstatSync(elementPath).isDirectory()) {
        recursive(fileArr, elementPath);
      } else if (
        typeof _filter !== 'function' ||
        _filter(elementPath) === true
      ) {
        fileArr.push(elementPath);
      }
    }

    return fileArr;
  }
};
