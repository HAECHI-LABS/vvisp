module.exports = async function(deployState, options) {
  const fs = require('fs-extra');
  const { SERVICE_PATH, STATE_PATH } = require('../../../config/Constant');
  const { VARIABLES } = require('../constants');
  const { forIn, printOrSilent } = require('@haechi-labs/vvisp-utils');
  const web3 = options.web3;

  let stateClone = deployState.getState();

  const config = fs.readJsonSync(SERVICE_PATH);

  let processState;
  if (!fs.existsSync(STATE_PATH)) {
    processState = 'Deploying';
    stateClone.notUpgrading = true;
    stateClone.contracts = {};
    stateClone.serviceName = config.serviceName;
  } else {
    const file = fs.readJsonSync(STATE_PATH);
    forIn(file, (object, name) => {
      stateClone[name] = object;
    });
    if (stateClone.paused) {
      processState = 'Resuming';
    } else {
      processState = 'Upgrading';
    }
  }
  printOrSilent(
    chalk.head(
      `\nStart ${processState} ${chalk.keyWord(config.serviceName)}...\n`
    ),
    options
  );

  deployState[VARIABLES] = config[VARIABLES];

  const compileInformation = require('./compareConfigAndState')(
    config.contracts,
    stateClone
  );

  if (Object.keys(compileInformation.targets).length === 0) {
    printOrSilent(chalk.head('Nothing to upgrade'), options);
    process.exit();
  }

  // Check whether this process needs Registry
  // Event occurs when user sets config.registry false
  if (config.registry === false) {
    // User cannot use upgradeable patterns without registry
    if (compileInformation.noProxy !== true) {
      throw new Error(
        `No Registry with upgradeable contracts is not allowed, change 'registry' from false to true in 'service.vvisp.json'`
      );
    } else {
      if (web3.utils.isAddress(stateClone.registry)) {
        printOrSilent(
          `${chalk.warning('Warning:')} Registry address ${
            stateClone.registry
          } will be deleted.`
        );
      }
      compileInformation.noRegistry = true;
      stateClone.registry = 'noRegistry';
    }
  } else if (stateClone.registry === 'noRegistry') {
    printOrSilent(
      `${chalk.warning(
        'Notice:'
      )} Sorry. In this version, we do not support adding registry in noRegistry service.\nKeep 'registry' property to false or re-deploy whole service.`
    );
    process.exit();
  }

  const compileOutput = await require('./compileAll')(
    compileInformation,
    options
  );
  require('./checkError')(compileInformation.targets, compileOutput, options);

  if (!stateClone.paused) {
    stateClone.paused = {};
    stateClone.paused.stage = 'deployRegistry';
  }
  deployState.compileOutput = compileOutput;
  deployState.targets = compileInformation.targets;

  deployState.updateState(stateClone);
};
