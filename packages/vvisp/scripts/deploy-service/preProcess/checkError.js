module.exports = function(targets, compileOutput, options) {
  const path = require('path');
  const {
    forIn,
    getCompiledContracts,
    getCycle,
    printOrSilent
  } = require('@haechi-labs/vvisp-utils');
  const { hasConstructArgs, hasInitArgs, getVar } = require('../utils/index');
  const { INITIALIZE, CONSTRUCTOR, UPGRADEABLE } = require('../constants');

  printOrSilent(chalk.head('Check Arguments...'), options);

  forIn(targets, (contract, name) => {
    const filePath = path.join('./', contract.path);
    const abi = JSON.parse(
      getCompiledContracts(compileOutput, filePath).interface
    );
    const hasInit = hasInitArgs(contract);
    const hasConstruct = hasConstructArgs(contract);
    if (hasInit && hasConstruct) {
      let initialize = false;
      let constructorArguments = false;
      for (let i = 0; i < abi.length; i++) {
        if (
          abi[i].name === contract[INITIALIZE].functionName &&
          abi[i].type === 'function'
        ) {
          if (contract[INITIALIZE].arguments.length !== abi[i].inputs.length) {
            throw new Error(
              `Arguments Number Error at ${name}: Expected ${
                abi[i].inputs.length
              }, but ${contract[INITIALIZE].arguments.length}`
            );
          }
          initialize = true;
        }
        if (abi[i].type === 'constructor') {
          if (contract[CONSTRUCTOR].length !== abi[i].inputs.length) {
            throw new Error(
              `Constructor Arguments Number Error at ${name}: Expected ${
                abi[i].inputs.length
              }, but ${contract[CONSTRUCTOR].length}`
            );
          }
          constructorArguments = true;
        }
        if (initialize && constructorArguments) {
          break;
        }
      }
    } else if (hasInit) {
      for (let i = 0; i < abi.length; i++) {
        if (
          abi[i].name === contract[INITIALIZE].functionName &&
          abi[i].type === 'function'
        ) {
          if (contract[INITIALIZE].arguments.length !== abi[i].inputs.length) {
            throw new Error(
              `Arguments Number Error at ${name}: Expected ${
                abi[i].inputs.length
              }, but ${contract[INITIALIZE].arguments.length}`
            );
          }
          break;
        }
      }
    } else if (hasConstruct) {
      for (let i = 0; i < abi.length; i++) {
        if (abi[i].type === 'constructor') {
          if (contract[CONSTRUCTOR].length !== abi[i].inputs.length) {
            throw new Error(
              `Constructor Arguments Number Error at ${name}: Expected ${
                abi[i].inputs.length
              }, but ${contract[CONSTRUCTOR].length}`
            );
          }
          break;
        }
      }
    }
  });
  printOrSilent(chalk.success('Done\n'), options);

  printOrSilent(chalk.head('Check Dependencies...'), options);
  const dependencyGraph = {};
  forIn(targets, (contract, name) => {
    if (contract[UPGRADEABLE] === true) {
      return;
    }
    if (hasConstructArgs(contract)) {
      for (let i = 0; i < contract[CONSTRUCTOR].length; i++) {
        const variable = getVar(contract[CONSTRUCTOR][i]);
        if (!variable) {
          continue;
        }
        const splits = variable.split('.');
        if (splits[0] === 'contracts') {
          if (!dependencyGraph[name]) {
            dependencyGraph[name] = [];
          }
          dependencyGraph[name].push(splits[1]);
        }
      }
    }
  });
  const result = getCycle(dependencyGraph);
  if (result) {
    throw new Error('Cyclic Dependency Detection: ' + JSON.stringify(result));
  }
  printOrSilent(chalk.success('Done\n'), options);
};
