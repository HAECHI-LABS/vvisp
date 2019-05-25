module.exports = async function(files, options) {
    options = require('./utils/injectConfig')(options);
    const path = require('path');
    const { getAllFiles, printOrSilent } = require('@haechi-labs/vvisp-utils');
    const PACKAGE_JSON = path.join(__dirname, '../package.json');


    printOrSilent(PACKAGE_JSON);
    printOrSilent('Compiling Finished!', options);
  };
  