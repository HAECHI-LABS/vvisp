module.exports = function(compileOutput, filePath, options) {
  const {
    getCompiledContracts,
    getContractFactory
  } = require('@haechi-labs/vvisp-utils');
  const Contract = getContractFactory(options);

  const abi = getCompiledContracts(compileOutput, filePath).interface;
  return new Contract(JSON.parse(abi));
};
