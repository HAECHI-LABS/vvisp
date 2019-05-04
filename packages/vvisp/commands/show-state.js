const { showState } = require('../scripts');

const name = 'show-state';
const signature = `${name} <contract>`;
const description = 'show the smart contract\'s state';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .alias('ss')
    .usage('<contract> [options]')
//    .option('-S, --source <file>', 'the original contract source file') //TO DO: ehter scan option?
    .description(description)
    .action(showState)

module.exports = { name, signature, description, register, showState };
