const { init } = require('../scripts');

const name = 'init';
const signature = `${name} [name]`;
const description = 'initialize directory to use haechi-cli';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('[name]')
    .description(description)
    .action(init);

module.exports = { name, signature, description, register, init };
