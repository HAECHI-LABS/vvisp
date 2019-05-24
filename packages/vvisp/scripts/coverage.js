module.exports = async function(files, options) {
    options = require('./utils/injectConfig')(options);
    const path = require('path');
    const { getAllFiles, printOrSilent } = require('@haechi-labs/vvisp-utils');

    printOrSilent(path);
    printOrSilent('Compiling Finished!', options);
  };
  