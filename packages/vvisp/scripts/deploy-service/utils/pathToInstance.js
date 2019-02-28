module.exports = function(compileOutput, filePath) {
  const {
    getCompiledContracts,
    web3Store
  } = require('@haechi-labs/vvisp-utils');
  const web3 = web3Store.get();

  const abi = getCompiledContracts(compileOutput, filePath).interface;
  return new web3.eth.Contract(JSON.parse(abi));
};
