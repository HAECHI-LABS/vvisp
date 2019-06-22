// TODO: will be deprecated at next major version

module.exports = async function(filePath, privateKey, arguments, options) {
  const compile = require('./compile');
  const deploy = require('./deploy');
  const printOrSilent = require('./printOrSilent');
  const path = require('path');

  const output = await compile(filePath, options);
  const name = path.parse(filePath).name;

  const deployTarget = output.contracts[filePath + ':' + name];

  printOrSilent('Deploying ' + name + '.sol...', options);
  const receipt = await deploy(deployTarget, privateKey, arguments, options);

  printOrSilent(name + ' Contract Created!', options);
  printOrSilent('Contract Address: ' + receipt.contractAddress, options);

  return receipt;
};
