module.exports = async function(options) {
  options = require('../utils/injectConfig')(options);
  const { checkServiceFileExist } = require('../../bin/error');
  checkServiceFileExist();

  const { printOrSilent } = require('@haechi-labs/vvisp-utils');
  const { writeState } = require('./utils');
  const DeployState = require('./DeployState');
  const preProcess = require('./preProcess');
  const {
    PROJECT_NAME,
    SERVICE_FILE,
    STATE_FILE
  } = require('../../config/Constant');
  const {
    deployContracts,
    deployRegistry,
    initContracts,
    injectVar,
    reflectState
  } = require('./processes');
  const fs = require('fs-extra');
  const path = require('path');
  const chk = require('chalk');
  global.chalk = {
    success: chk.green.bold,
    address: chk.cyan,
    tx: chk.cyan,
    head: chk.bold,
    error: chk.red.bold,
    keyWord: chk.blue.bold,
    notImportant: chk.gray,
    warning: chk.yellow
  };

  if (options.force) {
    fs.removeSync(path.join('./', STATE_FILE));
  }

  await main();

  async function main() {
    const deployState = new DeployState();

    await preProcess(deployState, options);

    const processes = [
      {
        name: 'deployRegistry',
        process: async function() {
          await deployRegistry(deployState, options);
        }
      },
      {
        name: 'injectVar',
        process: async function() {
          injectVar(deployState);
        }
      },
      {
        name: 'deployContracts',
        process: async function() {
          await deployContracts(deployState, options);
        }
      },
      {
        name: 'initContracts',
        process: async function() {
          await initContracts(deployState, options);
        }
      },
      {
        name: 'reflectState',
        process: function() {
          reflectState(deployState, options);
        }
      }
    ];

    printOrSilent(chalk.head('Now Start Deploying Contracts...\n'), options);

    await runProcess(deployState, processes, options).catch(e =>
      writePausedState(e, deployState, options)
    );
  }

  async function runProcess(deployState, processes, options) {
    let stateClone = deployState.getState();
    const { notUpgrading } = stateClone;
    for (let i = 0; i < processes.length; i++) {
      if (stateClone.paused.stage === processes[i].name) {
        await processes[i].process();
        stateClone = deployState.getState();
        if (i === processes.length - 1) {
          const processState = notUpgrading ? 'Deploying' : 'Upgrading';
          printOrSilent(
            chalk.success(`${processState} ${stateClone.serviceName} Finished`),
            options
          );
          printOrSilent(
            `You can see result in ${chalk.keyWord(SERVICE_FILE)}`,
            options
          );
        } else {
          stateClone.paused = { stage: processes[i + 1].name };
          stateClone = deployState.updateState(stateClone).getState();
        }
      }
    }
  }

  function writePausedState(error, deployState, options) {
    const stateClone = deployState.getState();
    if (error) {
      printOrSilent(error, options);
    }
    if (!stateClone || !stateClone.paused) {
      return;
    }
    printOrSilent(chalk.error(`Service State Paused!`), options);
    printOrSilent(
      `Resume Process by Running ${chalk.keyWord(
        `${PROJECT_NAME} deploy-service`
      )} Again.`,
      options
    );
    writeState(stateClone, options);
  }
};
