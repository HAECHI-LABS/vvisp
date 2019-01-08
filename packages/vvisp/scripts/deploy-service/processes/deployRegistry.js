module.exports = async function(deployState, options) {
  const { PRIVATE_KEY, TX_OPTIONS, REGISTRY_PATH } = require('../constants');
  const {
    deploy,
    getCompiledContracts,
    printOrSilent
  } = require('@haechi-labs/vvisp-utils');

  const stateClone = deployState.getState();
  if (
    stateClone.registry === 'noRegistry' ||
    stateClone.notUpgrading !== true
  ) {
    return;
  }

  printOrSilent('Registry Deploying...', options);
  const compileOutput = deployState.compileOutput;

  const receipt = await deploy(
    getCompiledContracts(compileOutput, REGISTRY_PATH),
    PRIVATE_KEY,
    { ...options, ...TX_OPTIONS }
  );
  printOrSilent(`Registry Created!`, options);
  printOrSilent(
    `${chalk.success('Done')} Contract Address: ${chalk.address(
      receipt.contractAddress
    )}\n`,
    options
  );
  stateClone.registry = receipt.contractAddress;
  deployState.updateState(stateClone);
};
