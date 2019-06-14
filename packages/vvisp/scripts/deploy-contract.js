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

  arguments = arguments.map(arg => {
    // convert array string to array
    // "[0x123, 0x234]" to ["0x123", "0x234"]
    if (arg.startsWith('[') && arg.endsWith(']')) {
      return arg
        .slice(1, arg.length - 1)
        .split(/\s*,\s*/)
        .map(v => {
          // remove empty space for each element
          return v.trim();
        });
    }
    return arg;
  });

  await compileAndDeploy(file, privateKey, arguments, options);

  printOrSilent('Deploying Finished!', options);
};
