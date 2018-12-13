module.exports = function(privateKey) {
  const filterPrivateKey = require('./utils/filterPrivateKey');
  privateKey = filterPrivateKey(privateKey);
  const web3 = require('./getWeb3')();

  return web3.eth.accounts.privateKeyToAccount(privateKey).address;
};
