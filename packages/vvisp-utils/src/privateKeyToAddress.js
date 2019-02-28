module.exports = function(privateKey) {
  const filterPrivateKey = require('./filterPrivateKey');
  privateKey = filterPrivateKey(privateKey);
  const web3 = require('./web3Store').get();

  return web3.eth.accounts.privateKeyToAccount(privateKey).address;
};
