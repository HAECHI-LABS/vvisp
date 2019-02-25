module.exports = async function(options) {
  const { checkConfigExist, checkEnv } = require('../../bin/error');
  checkEnv();
  checkConfigExist();

  const { printOrSilent } = require('@haechi-labs/vvisp-utils');
  const { writeState } = require('./utils');
  const DeployState = require('./DeployState');
  const preProcess = require('./preProcess');
  const { PROJECT_NAME, SERVICE_FILE } = require('../../config/Constant');
  const {
    deployBusinesses,
    deployNonUpgradeables,
    deployProxies,
    deployRegistry,
    initNonUpgradeables,
    injectVar,
    reflectState,
    registerFileNames,
    upgradeAll
  } = require('./processes');
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
        name: 'deployBusinesses',
        process: async function() {
          await deployBusinesses(deployState, options);
        }
      },
      {
        name: 'deployProxies',
        process: async function() {
          await deployProxies(deployState, options);
        }
      },
      {
        name: 'injectVar',
        process: async function() {
          injectVar(deployState);
        }
      },
      {
        name: 'deployNonUpgradeables',
        process: async function() {
          await deployNonUpgradeables(deployState, options);
        }
      },
      {
        name: 'upgradeAll',
        process: async function() {
          await upgradeAll(deployState, options);
        }
      },
      {
        name: 'registerFileNames',
        process: async function() {
          await registerFileNames(deployState, options);
        }
      },
      {
        name: 'initNonUpgradeables',
        process: async function() {
          await initNonUpgradeables(deployState, options);
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
