module.exports = async function(deployState, options) {
  const fs = require('fs-extra');
  const { SERVICE_PATH, STATE_PATH, VARIABLES } = require('../constants');
  const { forIn, printOrSilent } = require('../../../lib');

  let stateClone = deployState.getState();
  const config = fs.readJsonSync(SERVICE_PATH);

  if (!fs.existsSync(STATE_PATH)) {
    printOrSilent(`\nStart Deploying ${config.serviceName}...\n`, options);
    stateClone.notUpgrading = true;
    stateClone.contracts = {};
    stateClone.serviceName = config.serviceName;
  } else {
    const file = fs.readJsonSync(STATE_PATH);
    forIn(file, (object, name) => {
      stateClone[name] = object;
    });
    if (stateClone.paused) {
      printOrSilent(`\nResuming ${config.serviceName}...\n`, options);
    } else {
      printOrSilent(`\nStart Upgrading ${config.serviceName}...\n`, options);
    }
  }

  deployState[VARIABLES] = config[VARIABLES];

  const targets = require('./compareConfigAndState')(
    config.contracts,
    stateClone
  );

  const compileOutput = await require('./compileAll')(targets, options);
  require('./checkError')(targets, compileOutput, options);

  if (!stateClone.paused) {
    stateClone.paused = {};
    stateClone.paused.stage = 'deployRegistry';
  }
  deployState.compileOutput = compileOutput;
  deployState.targets = targets;

  deployState.updateState(stateClone);
};
