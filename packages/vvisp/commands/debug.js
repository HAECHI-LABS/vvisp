const { debug } = require('../scripts');

const name = 'debug';
const signature = `${name} [files...]`;
const description = 'debug the smart contracts';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('[files...] [options]')
    .description(description)
    .action(debug)
    .addCustomConfigOption();

module.exports = { name, signature, description, register, debug };
