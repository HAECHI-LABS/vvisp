const { coverage } = require('../scripts');

const name = 'coverage';
const signature = `${name}`;
const description = 'smart contract test coverage';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .alias('covr')
    .usage('[options]')
//    .option('-S, --source <file>', 'the original contract source file') //TO DO: ehter scan option?
    .description(description)
    .action(coverage);
module.exports = { name, signature, description, register, coverage };
