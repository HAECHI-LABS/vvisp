const { DEFAULT_PLATFORM, ETHEREUM, KLAYTN } = require('../../constants');

module.exports = function(target, options = {}) {
  switch (options.platform || DEFAULT_PLATFORM) {
    case ETHEREUM: {
      const web3 = require('../web3Store').get();
      if (web3.utils.isAddress(target)) {
        return web3.eth.getTransactionCount(target);
      } else {
        const privateKeyToAddress = require('./privateKeyToAddress');
        return web3.eth.getTransactionCount(
          privateKeyToAddress(target, options)
        );
      }
    }
    case KLAYTN: {
      const caver = require('../caverStore').get();
      if (caver.utils.isAddress(target)) {
        return caver.klay.getTransactionCount(target);
      } else {
        const privateKeyToAddress = require('./privateKeyToAddress');
        return caver.klay.getTransactionCount(
          privateKeyToAddress(target, options)
        );
      }
    }
    default:
      throw new Error('platform is not defined');
  }
};
