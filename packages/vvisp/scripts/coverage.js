module.exports = async function(files, options) {
    options = require('./utils/injectConfig')(options);
    const { getAllFiles, printOrSilent } = require('@haechi-labs/vvisp-utils');
    printOrSilent('Compiling Finished!', options);
  };
  