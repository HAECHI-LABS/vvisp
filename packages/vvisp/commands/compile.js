const { compile } = require('../scripts');

const name = 'compile';
const signature = `${name} [files...]`;
const description = 'compile the smart contracts';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('[files...] [options]')
    .description(description)
    .action(compile)
    .addCustomConfigOption()
    .addSilentOption();

module.exports = { name, signature, description, register, compile };
