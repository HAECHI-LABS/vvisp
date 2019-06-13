const { printOrSilent } = require('@haechi-labs/vvisp-utils');
const {
  exec,
  execFile,
  execSync
} = require('child_process');


module.exports = async function(files, options) {

  let test_command = './node_modules/.bin/truffle test';
  let bc_command = './node_modules/.bin/ganache-cli';
  let port = 8545;

  if (options.coverage) {
    test_command = './node_modules/.bin/solidity-coverage';
    bc_command = './node_modules/.bin/testrpc-sc';
    port = 8555;
  }

  files.forEach(file => {
    test_command += ` ${file}`;
  })

  let ganache_process;
  try {
    execSync(`nc -z localhost ${port}`) // check port listening...
  } catch {
    ganache_process = execFile(
      bc_command,
      [
        `--port=${port}`,
        '--gasLimit=0xfffffffffff'
      ],
      (error, stdout, stderr) => {}
    );
  }

  exec(test_command, (error, stdout, stderr) => {
    printOrSilent(stdout, options);

    if (ganache_process) {
      ganache_process.kill();
    }
  });
}
