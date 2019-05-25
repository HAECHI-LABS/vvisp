module.exports = async function(files, options) {
    options = require('./utils/injectConfig')(options);
    const path = require('path');
    const { getAllFiles, printOrSilent } = require('@haechi-labs/vvisp-utils');
    

  let rootDir = path.join('./');
  if (options && options.directory) {
    rootDir = path.join(options.directory);
  }
    printOrSilent(rootDir);
    printOrSilent('Compiling Finished!', options);
  };
  