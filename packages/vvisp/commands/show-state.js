const { showState } = require('../scripts');

const name = 'show-state';
const signature = `${name} <address>`;
const description = 'show the smart contract\'s state';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .alias('ss')
    .usage('<address> [options]')
    .option('-S, --source <file>', 'the original contract source file')
    .description(description)
    .action(showState)

module.exports = { name, signature, description, register, showState };
