module.exports = async function(files, options) {
    options = require('./utils/injectConfig')(options);
    printOrSilent('Compiling Finished!', options);
  };
  