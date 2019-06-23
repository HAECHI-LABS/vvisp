const { deployContract } = require('../scripts');

const name = 'deploy-contract';
const signature = `${name} <file> [arguments...]`;
const description = 'deploy the smart contracts';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('<file> [arguments...]')
    .description(description)
.action((...args) => {
  deployContract(...args).catch(e => console.log(e));
})
    .addNetworkOption()
    .addSilentOption();

module.exports = { name, signature, description, register, deployContract };
