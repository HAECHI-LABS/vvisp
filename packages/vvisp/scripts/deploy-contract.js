module.exports = async function(file, arguments, options) {
  options = require('./utils/injectConfig')(options);

  const {
    compileAndDeploy,
    printOrSilent
  } = require('@haechi-labs/vvisp-utils');

  const privateKey = options.config.from;

  options = {
    ...options,
    gasPrice: options.config.gasPrice,
    gasLimit: options.config.gasLimit
  };

  await compileAndDeploy(file, privateKey, arguments, options);

  printOrSilent('Deploying Finished!', options);
};
