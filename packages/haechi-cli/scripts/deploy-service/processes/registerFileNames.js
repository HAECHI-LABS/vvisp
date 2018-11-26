module.exports = async function(deployState, options) {
  const {
    PRIVATE_KEY,
    REGISTRY_PATH,
    TX_OPTIONS,
    UPGRADEABLE
  } = require('../constants');
  const {
    forIn,
    getTxCount,
    printOrSilent,
    sendTx
  } = require('@haechi-labs/haechi-utils');
  const { pathToInstance } = require('../utils/index');

  const { compileOutput, targets } = deployState;
  let stateClone = deployState.getState();

  const upgradeables = [];
  forIn(targets, (contract, name) => {
    if (contract[UPGRADEABLE] === true) {
      upgradeables.push(stateClone.contracts[name]);
    }
  });

  if (upgradeables.length === 0) {
    return;
  }

  const registryInstance = pathToInstance(compileOutput, REGISTRY_PATH);
  registryInstance.options.address = stateClone.registry;

  const _proxies = [];
  let _fileNames = '';
  const _fileNameLength = [];
  for (let i = 0; i < upgradeables.length; i++) {
    _proxies.push(upgradeables[i].proxy);
    _fileNames += upgradeables[i].fileName;
    _fileNameLength.push(upgradeables[i].fileName.length);
  }

  const txData = registryInstance.methods
    .updateFileNames(_proxies, _fileNames, _fileNameLength)
    .encodeABI();
  printOrSilent(
    chalk.head("\tRegister Upgradeable Contracts' Information åt Registry..."),
    options
  );

  const receipt = await sendTx(stateClone.registry, 0, PRIVATE_KEY, {
    ...options,
    ...TX_OPTIONS,
    txCount: await getTxCount(PRIVATE_KEY),
    data: txData
  });
  printOrSilent(
    `${chalk.success('Done')} Transaction Hash: ${chalk.tx(
      receipt.transactionHash
    )}\n`,
    options
  );

  for (let i = 0; i < upgradeables.length; i++) {
    delete upgradeables[i].pending;
  }
  deployState.updateState(stateClone);
};
