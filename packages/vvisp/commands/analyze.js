const { analyze } = require('../scripts');

const name = 'analyze';
const signature = `${name} <file> [arguments...]`;
const description = 'analyze the smart contracts';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('<file> [arguments...]')
    .description(description)
    .action(analyze)

module.exports = { name, signature, description, register, analyze };
