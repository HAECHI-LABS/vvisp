module.exports = async function(filePath, privateKey, arguments, options) {
  const compile = require('./compile');
  const deploy = require('./deploy');
  const path = require('path');

  const output = await compile(filePath);
  const name = path.parse(filePath).name;

  const deployTarget = output.contracts[filePath + ':' + name];

  console.log('Deploying ' + name + '.sol...');
  const receipt = await deploy(deployTarget, privateKey, arguments, options);

  console.log(name + ' Contract Created!');
  console.log('Contract Address: ' + receipt.contractAddress);

  return receipt;
};
