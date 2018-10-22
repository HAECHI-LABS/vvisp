module.exports = function(_privKey) {
  const web3 = require('./getWeb3')();

  if (_privKey[0] + _privKey[1] !== '0x') {
    _privKey = '0x' + _privKey;
  }

  return web3.eth.accounts.privateKeyToAccount(_privKey).address;
};
