const { genScript } = require('../scripts');

const name = 'gen-script';
const signature = `${name} [files...]`;
const description = `generate javascript libraries communicating the smart contracts`;

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('[files...] [options]')
    .option('-f, --front <name>', 'generate the front-end javascript library')
    .description(description)
    .action(genScript)
    .addCustomConfigOption();

module.exports = { name, signature, description, register, genScript };
