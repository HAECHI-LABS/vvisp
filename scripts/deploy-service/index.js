module.exports = async function(options) {
  const { checkConfigExist, checkEnvExist } = require('../../bin/error');
  checkEnvExist();
  checkConfigExist();

  const { printOrSilent } = require('../../lib');
  const { writeState } = require('./utils');
  const DeployState = require('./DeployState');
  const preProcess = require('./preProcess');
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

  await main();

  async function main() {
    const deployState = new DeployState();

    await preProcess(deployState, options);

    const processes = [
      {
        name: 'deployRegistry',
        process: async function() {
          const stateClone = deployState.getState();
          if (stateClone.notUpgrading) {
            await deployRegistry(deployState, options);
          }
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

    printOrSilent('Now Start Deploying Contracts...\n', options);

    await runProcess(deployState, processes, options).catch(e =>
      writePausedState(e, deployState, options)
    );
  }

  async function runProcess(deployState, processes, options) {
    let stateClone = deployState.getState();
    for (let i = 0; i < processes.length; i++) {
      if (stateClone.paused.stage === processes[i].name) {
        await processes[i].process();
        stateClone = deployState.getState();
        if (i === processes.length - 1) {
          printOrSilent(
            `Deploying ${stateClone.serviceName} Finished`,
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
    printOrSilent('Service State Paused!', options);
    writeState(stateClone, options);
  }
};
