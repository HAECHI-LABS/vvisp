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
  let ganacheBinPath;
  let port;

  if (options.coverage) {
    ganacheBinPath = './node_modules/.bin/testrpc-sc';
    port = 8555;
  } else {
    ganacheBinPath = './node_modules/.bin/ganache-cli';
    port = 8545;
  }

  return spawn(ganacheBinPath, [`--port=${port}`, '--gasLimit=0xfffffffffff']);
}

function spawnTest(files, options) {
  let testBinPath;
  let args = [];

  if (options.coverage) {
    testBinPath = './node_modules/.bin/solidity-coverage';
  } else {
    testBinPath = './node_modules/.bin/truffle';
    args.push('test');
  }

  args = args.concat(files);

  return spawn(testBinPath, args);
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