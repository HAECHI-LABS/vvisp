module.exports = async function(deployState, options) {
  const path = require('path');
  const _ = require('lodash');
  const { CONSTRUCTOR, PRIVATE_KEY, TX_OPTIONS } = require('../constants');
  const {
    deploy,
    forIn,
    getTxCount,
    printOrSilent
  } = require('@haechi-labs/vvisp-utils');

  const { compileOutput, targets } = deployState;
  let stateClone = deployState.getState();

  const deployTargets = [];
  if (!stateClone.paused.details) {
    stateClone.paused.details = {};
    forIn(targets, (contract, name) => {
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

  printOrSilent(chalk.head('Deploying Contracts...\n'), options);

  const txCount = await getTxCount(PRIVATE_KEY, options);
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
      const contractName = targets[name].name;
      printOrSilent(contractName + ' Contract Deploying...', options);
      const receipt = await deploy(
        compileOutput.contracts[filePath + ':' + contractName],
        PRIVATE_KEY,
        contract[CONSTRUCTOR],
        { ...options, ...TX_OPTIONS, txCount: txCount + deployCount }
      );
      stateClone.paused.details[name] = true;
      contract.address = receipt.contractAddress;
      contract.fileName = path.parse(filePath).name + '.sol';

      if (contract.childNode && contract.childNode.length > 0) {
        for (let j = 0; j < contract.childNode.length; j++) {
          const childNodePath = contract.childNode[j].split('/');
          const childNode = stateClone.contracts[childNodePath[0]];
          let arguments =
            childNodePath[1] === CONSTRUCTOR
              ? childNode[childNodePath[1]]
              : childNode[childNodePath[1]].arguments;
          injectAddress(arguments, childNodePath, 2, receipt.contractAddress);
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
      printOrSilent(contractName + ' Contract Deployed!', options);
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

  function injectAddress(_arguments, _path, _index, contractAddress) {
    const argumentIndex = _path[_index];
    if (Array.isArray(_arguments[argumentIndex])) {
      injectAddress(
        _arguments[argumentIndex],
        _path,
        _index + 1,
        contractAddress
      );
    } else {
      _arguments[argumentIndex] = contractAddress;
    }
  }
};
