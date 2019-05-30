const { analyze } = require('../scripts');

const name = 'analyze';
const signature = `${name} [files...]`;
const description = 'analyze the smart contracts';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('[files...]')
    .option('-a, --all-contract', 'analyze all contract')
    .description(description)
    .action(analyze)

module.exports = { name, signature, description, register, analyze };
