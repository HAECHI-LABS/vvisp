module.exports = async function(deployState, options) {
  const path = require('path');
  const {
    INITIALIZE,
    PRIVATE_KEY,
    TX_OPTIONS,
    UPGRADEABLE
  } = require('../constants');
  const {
    forIn,
    getTxCount,
    printOrSilent,
    sendTx
  } = require('../../../lib/index');
  const { pathToInstance } = require('../utils/index');

  const { compileOutput, targets } = deployState;
  let stateClone = deployState.getState();

  const nonUpgradeables = [];
  forIn(targets, (contract, name) => {
    if (contract[UPGRADEABLE] !== true) {
      nonUpgradeables.push({ name: name, contract: contract });
    }
  });

  if (nonUpgradeables.length === 0) {
    return;
  }

  printOrSilent(
    chalk.head('\tStart Initialize NonUpgradeable Contracts...'),
    options
  );

  const startCount = await getTxCount(PRIVATE_KEY);
  let txCount = startCount;

  for (let i = 0; i < nonUpgradeables.length; i++) {
    const { contract, name } = nonUpgradeables[i];
    const stateContract = stateClone.contracts[name];

    const initialize = stateContract[INITIALIZE];
    if (initialize && initialize.functionName) {
      const instancePath = path.join('./', contract.path);
      const contractName = path.parse(instancePath).name;
      const instance = pathToInstance(compileOutput, instancePath);
      const initData = instance.methods[initialize.functionName](
        ...initialize.arguments
      ).encodeABI();
      printOrSilent(`Initializing ${contractName}...`, options);
      const receipt = await sendTx(stateContract.address, 0, PRIVATE_KEY, {
        ...options,
        ...TX_OPTIONS,
        txCount: txCount,
        data: initData
      });
      txCount++;
      printOrSilent(
        `${chalk.success('Done')} Transaction Hash: ${chalk.tx(
          receipt.transactionHash
        )}\n`,
        options
      );
    }
    delete stateContract.pending;
    stateClone = deployState.updateState(stateClone).getState();
  }
  if (startCount === (await getTxCount(PRIVATE_KEY))) {
    printOrSilent('Nothing to initialize!\n', options);
  }
};
