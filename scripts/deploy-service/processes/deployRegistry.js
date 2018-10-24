module.exports = async function(deployState, options) {
  const { PRIVATE_KEY, TX_OPTIONS, REGISTRY_PATH } = require('../constants');
  const {
    deploy,
    getCompiledContracts,
    printOrSilent
  } = require('../../../lib/index');

  printOrSilent('Registry Deploying...', options);
  const compileOutput = deployState.compileOutput;
  const stateClone = deployState.getState();

  const receipt = await deploy(
    getCompiledContracts(compileOutput, REGISTRY_PATH),
    PRIVATE_KEY,
    { ...options, ...TX_OPTIONS }
  );
  printOrSilent(`Registry Created!`, options);
  printOrSilent(`Contract Address: ${receipt.contractAddress}\n`, options);
  stateClone.registry = receipt.contractAddress;
  deployState.updateState(stateClone);
};
