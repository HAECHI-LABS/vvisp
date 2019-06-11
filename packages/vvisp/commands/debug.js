const { debug } = require('../scripts');

const name = 'debug';
const signature = `${name} [txHash]`;
const description = 'debug the smart contracts';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('[txHash] [options]')
    .description(description)
    .action(debug)
    .addCustomConfigOption();

module.exports = { name, signature, description, register, debug };
