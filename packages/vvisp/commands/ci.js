const { ci } = require('../scripts');

const name = 'ci';
const signature = `${name}`;
const description = 'continuous integration';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('[options]')
    .option('-r, --reset', 'new deployment')
    .description(description)
    .action(ci)

module.exports = { name, signature, description, register, ci };
