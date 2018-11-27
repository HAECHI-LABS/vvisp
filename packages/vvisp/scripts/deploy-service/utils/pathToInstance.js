module.exports = function(compileOutput, filePath) {
  const { getCompiledContracts, getWeb3 } = require('@haechi-labs/vvisp-utils');
  const web3 = getWeb3();

  const abi = getCompiledContracts(compileOutput, filePath).interface;
  return new web3.eth.Contract(JSON.parse(abi));
};
