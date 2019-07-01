const { test } = require('../scripts');

const name = 'test';
const signature = `${name} [files...]`;
const description = 'test smart contract';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('[options]')
    .option('-c, --coverage', 'with coverage test')
    .description(description)
    .action(test);
module.exports = { name, signature, description, register, test };
