const { abiToScript } = require('../scripts');

const name = 'abi-to-script';
const signature = `${name} <files...>`;
const description = `generate javascript libraries communicating the smart contracts`;

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('<files...> [options]')
    .option('-f, --front <name>', 'generate the front-end library')
    .description(description)
    .action(abiToScript);

module.exports = { name, signature, description, register, abiToScript };
