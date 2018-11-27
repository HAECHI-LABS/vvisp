module.exports = async function(deployState, options) {
  const path = require('path');
  const { pathToInstance } = require('../utils/index');
  const {
    PENDING_STATE,
    PRIVATE_KEY,
    REGISTRY_PATH,
    TX_OPTIONS,
    UPGRADEABLE
  } = require('../constants');
  const {
    forIn,
    forInAsync,
    getTxCount,
    printOrSilent,
    sendTx
  } = require('@haechi-labs/vvisp-utils');

  const compileOutput = deployState.compileOutput;
  let stateClone = deployState.getState();

  const txCount = await getTxCount(PRIVATE_KEY);
  const registryInstance = pathToInstance(compileOutput, REGISTRY_PATH);
  registryInstance.options.address = stateClone.registry;
  if (!stateClone.paused.details) {
    stateClone.paused.details = {};
    forIn(deployState.targets, (contract, name) => {
      if (
        contract[UPGRADEABLE] !== true ||
        contract.pending !== PENDING_STATE[0]
      ) {
        return;
      }
      stateClone.paused.details[name] = false;
    });
    stateClone = deployState.updateState(stateClone).getState();
  }

  printOrSilent(chalk.head('Deploying Proxy Contracts...\n'), options);

  let i = 0;
  await forInAsync(deployState.targets, async (contract, name) => {
    if (
      contract[UPGRADEABLE] !== true ||
      stateClone.paused.details[name] ||
      contract.pending !== PENDING_STATE[0]
    ) {
      return;
    }
    const filePath = path.join('./', contract.path);
    const contractName = path.parse(filePath).name;
    const txData = registryInstance.methods
      .createProxy(contractName)
      .encodeABI();
    printOrSilent(`${contractName} Proxy Deploying...`, options);
    const receipt = await sendTx(stateClone.registry, 0, PRIVATE_KEY, {
      ...options,
      ...TX_OPTIONS,
      data: txData,
      txCount: txCount + i
    });
    const contractAddress = '0x' + receipt.logs[0].data.slice(26, 66);
    stateClone.paused.details[name] = true;
    stateClone.contracts[name] = {
      ...stateClone.contracts[name],
      proxy: contractAddress
    };
    stateClone = deployState.updateState(stateClone).getState();
    printOrSilent(`${contractName} Proxy Created!`, options);
    printOrSilent(
      `${chalk.success('Done')} Contract Address: ${chalk.address(
        contractAddress
      )}\n`,
      options
    );
    i++;
  });
};
