module.exports = async function(deployState, options) {
  const path = require('path');
  const { PRIVATE_KEY, TX_OPTIONS, UPGRADEABLE } = require('../constants');
  const {
    deploy,
    forIn,
    forInAsync,
    getCompiledContracts,
    getTxCount,
    printOrSilent
  } = require('@haechi-labs/haechi-utils');

  const compileOutput = deployState.compileOutput;
  const contracts = deployState.targets;
  let stateClone = deployState.getState();

  const txCount = await getTxCount(PRIVATE_KEY);
  if (!stateClone.paused.details) {
    stateClone.paused.details = {};
    forIn(contracts, (contract, name) => {
      if (contract[UPGRADEABLE] !== true) {
        return;
      }
      stateClone.paused.details[name] = false;
    });
    stateClone = deployState.updateState(stateClone).getState();
  }

  printOrSilent(chalk.head('\tUpgradeable Contracts'), options);
  printOrSilent(chalk.head('Deploying Business Contracts...\n'), options);

  let i = 0;
  await forInAsync(contracts, async (contract, name) => {
    if (contract[UPGRADEABLE] !== true || stateClone.paused.details[name]) {
      return;
    }
    const filePath = path.join('./', contract.path);
    const contractName = path.parse(filePath).name;
    printOrSilent(contractName + ' Contract Deploying...', options);
    const receipt = await deploy(
      getCompiledContracts(compileOutput, filePath),
      PRIVATE_KEY,
      { ...options, ...TX_OPTIONS, txCount: txCount + i }
    );
    stateClone.paused.details[name] = true;
    if (!stateClone.contracts[name]) {
      stateClone.contracts[name] = {};
    }
    stateClone.contracts[name].address = receipt.contractAddress;
    stateClone.contracts[name].fileName = contractName + '.sol';
    stateClone = deployState.updateState(stateClone).getState();
    printOrSilent(contractName + ' Contract Created!', options);
    printOrSilent(
      `${chalk.success('Done')} Contract Address: ${chalk.address(
        receipt.contractAddress
      )}\n`,
      options
    );
    i++;
  });
};
