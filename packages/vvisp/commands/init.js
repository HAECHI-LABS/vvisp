const { init } = require('../scripts');

const name = 'init';
const signature = `${name} [name]`;
const description = 'initialize directory to use vvisp';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('[name]')
    .description(description)
    .action(init)
    .addSilentOption();

module.exports = { name, signature, description, register, init };
