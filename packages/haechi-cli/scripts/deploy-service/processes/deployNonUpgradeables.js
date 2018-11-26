module.exports = async function(deployState, options) {
  const path = require('path');
  const _ = require('lodash');
  const {
    CONSTRUCTOR,
    PRIVATE_KEY,
    REGISTRY_PATH,
    TX_OPTIONS,
    UPGRADEABLE
  } = require('../constants');
  const {
    deploy,
    forIn,
    getCompiledContracts,
    getTxCount,
    printOrSilent,
    sendTx
  } = require('@haechi-labs/haechi-utils');
  const { pathToInstance } = require('../utils/index');

  const { compileOutput, targets } = deployState;
  let stateClone = deployState.getState();

  const deployTargets = [];
  if (!stateClone.paused.details) {
    stateClone.paused.details = {};
    forIn(targets, (contract, name) => {
      if (contract[UPGRADEABLE] === true) {
        return;
      }
      deployTargets.push({ name: name });
      stateClone.paused.details[name] = false;
    });
    stateClone = deployState.updateState(stateClone).getState();
  } else {
    forIn(stateClone.paused.details, (isDeployed, name) => {
      if (!isDeployed) {
        deployTargets.push({ name: name });
      }
    });
  }

  if (deployTargets.length === 0) {
    return;
  }

  printOrSilent(chalk.head('\tNonUpgradeable Contracts'), options);
  printOrSilent(chalk.head('Deploying Contracts...\n'), options);

  const txCount = await getTxCount(PRIVATE_KEY);
  let deployCount = 0;
  const TOLERANCE = 30;
  let tolerance = 0; // 10
  while (deployCount !== deployTargets.length) {
    tolerance++;
    if (tolerance > TOLERANCE || deployCount > deployTargets.length) {
      throw new Error('Unexpected Error');
    }
    for (let i = 0; i < deployTargets.length; i++) {
      const name = deployTargets[i].name;
      const contract = stateClone.contracts[name];
      if (contract.parentNode && contract.parentNode.length > 0) {
        // Condition Check: still has dependencies
        continue;
      }
      if (contract.address) {
        // already deployed
        continue;
      }
      const filePath = path.join('./', targets[name].path);
      const contractName = path.parse(filePath).name;
      printOrSilent(contractName + ' Contract Deploying...', options);
      const receipt = await deploy(
        getCompiledContracts(compileOutput, filePath),
        PRIVATE_KEY,
        contract[CONSTRUCTOR],
        { ...options, ...TX_OPTIONS, txCount: txCount + deployCount }
      );
      stateClone.paused.details[name] = true;
      contract.address = receipt.contractAddress;
      contract.fileName = contractName + '.sol';

      if (contract.childNode && contract.childNode.length > 0) {
        for (let j = 0; j < contract.childNode.length; j++) {
          const childNodePath = contract.childNode[j].split('/');
          const childNode = stateClone.contracts[childNodePath[0]];
          const arguments =
            childNodePath[1] === CONSTRUCTOR
              ? childNode[childNodePath[1]]
              : childNode[childNodePath[1]].arguments;
          arguments[childNodePath[2]] = receipt.contractAddress;
          let notRemoved = true;
          _.remove(childNode.parentNode, function(parent) {
            const result = notRemoved && parent === name;
            if (result) {
              notRemoved = false;
            }
            return result;
          });
        }
        delete contract.childNode;
      }

      stateClone = deployState.updateState(stateClone).getState();
      printOrSilent(contractName + ' Contract Created!', options);
      printOrSilent(
        `${chalk.success('Done')} Contract Address: ${chalk.address(
          receipt.contractAddress
        )}\n`,
        options
      );
      deployCount++;
      tolerance = 0;
    }
  }

  const registryInstance = pathToInstance(compileOutput, REGISTRY_PATH);
  registryInstance.options.address = stateClone.registry;

  const setTargets = Object.keys(stateClone.paused.details);
  const _addresses = [];
  let _names = '';
  const _nameLength = [];
  let _filNames = '';
  const _fileNameLength = [];
  for (let i = 0; i < setTargets.length; i++) {
    const { address, fileName } = stateClone.contracts[setTargets[i]];
    _addresses.push(address);
    _names += setTargets[i];
    _nameLength.push(setTargets[i].length);
    _filNames += fileName;
    _fileNameLength.push(fileName.length);
  }
  const txData = registryInstance.methods
    .setNonUpgradeables(
      _addresses,
      _names,
      _nameLength,
      _filNames,
      _fileNameLength
    )
    .encodeABI();
  printOrSilent(
    chalk.head(
      "\tRegister NonUpgradeable Contracts' Information åt Registry..."
    ),
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
};
