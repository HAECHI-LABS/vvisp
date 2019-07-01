const portscanner = require('portscanner');
const spawn = require('cross-spawn');
const kill = require('tree-kill');
const { printOrSilent } = require('@haechi-labs/vvisp-utils');

module.exports = async function(files, options) {
  let ganacheProcess;
  let testProcess;

  if (options.coverage) {
    ganacheProcess = spawnTemporaryGanache(options);
    testProcess = spawnTest(files, options);
    addListenerToTestProcess(testProcess, ganacheProcess, options);
  } else {
    portscanner.checkPortStatus(8545, '127.0.0.1', (error, status) => {
      if (status === 'closed') {
        ganacheProcess = spawnTemporaryGanache(options);
      }
      testProcess = spawnTest(files, options);
      addListenerToTestProcess(testProcess, ganacheProcess, options);
    });
  }
};

function spawnTemporaryGanache(options) {
  let args;

  if (options.coverage) {
    args = ['testrpc-sc', '--port=8555', '--gasLimit=0xfffffffffff'];
  } else {
    args = ['ganache-cli', '--port=8545', '--gasLimit=0xfffffffffff'];
  }

  return spawn('npx', args);
}

function spawnTest(files, options) {
  let args;

  if (options.coverage) {
    args = ['solidity-coverage'];
  } else {
    args = ['truffle', 'test'];
  }

  args = args.concat(files);

  return spawn('npx', args);
}

function addListenerToTestProcess(testProcess, ganacheProcess, options) {
  testProcess.stdout.on('data', data => {
    printOrSilent(data.toString(), options);
  });

  testProcess.stderr.on('data', data => {
    printOrSilent(data.toString(), options);
  });

  testProcess.on('close', code => {
    if (ganacheProcess) {
      kill(ganacheProcess.pid);
    }
  });
}