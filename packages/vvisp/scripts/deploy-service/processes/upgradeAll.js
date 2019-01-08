module.exports = async function(deployState, options) {
  const path = require('path');
  const {
    INITIALIZE,
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
  } = require('@haechi-labs/vvisp-utils');
  const { pathToInstance } = require('../utils/index');

  const { compileOutput, targets } = deployState;
  let stateClone = deployState.getState();

  if (stateClone.noProxy === true) {
    return;
  }

  const upgradeables = [];
  forIn(targets, (contract, name) => {
    if (contract[UPGRADEABLE] === true) {
      upgradeables.push({ name: name });
    }
  });

  if (upgradeables.length === 0) {
    return;
  }

  const registryInstance = pathToInstance(compileOutput, REGISTRY_PATH);
  registryInstance.options.address = stateClone.registry;

  let _proxies = [];
  let _implements = [];
  let _data = '0x';
  let _length = [];

  for (let i = 0; i < upgradeables.length; i++) {
    const { name } = upgradeables[i];
    const stateContract = stateClone.contracts[name];
    _proxies.push(stateContract.proxy);
    _implements.push(stateContract.address);

    const initialize = stateContract[INITIALIZE];
    if (initialize && initialize.functionName) {
      const instancePath = path.join('./', stateContract.path);
      const instance = pathToInstance(compileOutput, instancePath);
      const initData = instance.methods[initialize.functionName](
        ...initialize.arguments
      )
        .encodeABI()
        .slice(2);
      _data += initData;
      _length.push(initData.length / 2);
    } else {
      _length.push(0);
    }
  }

  const txData = registryInstance.methods
    .upgradeToAndCalls(_proxies, _implements, _data, _length)
    .encodeABI();
  printOrSilent(
    chalk.head(`\tNow Connect Upgradeable Contracts with Registry...`),
    options
  );

  const receipt = await sendTx(stateClone.registry, 0, PRIVATE_KEY, {
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
};
