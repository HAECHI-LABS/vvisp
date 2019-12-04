const { server } = require('../scripts');

const name = 'server';
const signature = `${name} [script-api-path]`;
const description = 'run rest api server to execute contract functions';

const register = commander =>
  commander
    .command(signature, { noHelp: true })
    .usage('[script-api-path]')
    .description(description)
    .action((...args) => {
      server(...args).catch(e => console.log(e));
    })
    .addNetworkOption();

module.exports = { name, signature, descrition, register, server };
