const { DEFAULT_PLATFORM, ETHEREUM, KLAYTN } = require('../../constants');

module.exports = function(privateKey, options = {}) {
  const filterPrivateKey = require('../filterPrivateKey');
  privateKey = filterPrivateKey(privateKey);
  switch (options.platform || DEFAULT_PLATFORM) {
    case ETHEREUM: {
      const web3 = require('../web3Store').get();
      return web3.eth.accounts.privateKeyToAccount(privateKey).address;
    }
    case KLAYTN: {
      const caver = require('../caverStore').get();

      return caver.klay.accounts.privateKeyToAccount(privateKey).address;
    }
    default:
      throw new Error('platform is not defined');
  }
};
