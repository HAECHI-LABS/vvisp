const { DEFAULT_PLATFORM, ETHEREUM, KLAYTN } = require('../../constants');

module.exports = function(target, options = {}) {
  switch (options.platform || DEFAULT_PLATFORM) {
    case ETHEREUM: {
      const web3 = require('../web3Store').get();
      if (web3.utils.isAddress(target)) {
        return web3.eth.getTransactionCount(target);
      } else {
        const getAddress = require('./getAddress');
        return web3.eth.getTransactionCount(getAddress(target, options));
      }
    }
    case KLAYTN: {
      const caver = require('../caverStore').get();
      if (caver.utils.isAddress(target)) {
        return caver.klay.getTransactionCount(target);
      } else {
        const getAddress = require('./getAddress');
        return caver.klay.getTransactionCount(getAddress(target, options));
      }
    }
    default:
      throw new Error('platform is not defined');
  }
};
