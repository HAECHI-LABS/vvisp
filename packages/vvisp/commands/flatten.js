const { flatten } = require('../scripts');

const name = 'flatten';
const signature = `${name} <files...>`;
const description = 'flatten the smart contracts';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('<files...>')
    .option('-o, --output <name>', 'the output file name')
    .description(description)
    .action((...args) => {
      flatten(...args).catch(e => console.log(e));
    })
    .addSilentOption();

module.exports = { name, signature, description, register, flatten };
