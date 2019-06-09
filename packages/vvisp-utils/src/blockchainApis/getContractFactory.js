const { DEFAULT_PLATFORM, ETHEREUM, KLAYTN } = require('../../constants');

module.exports = function(options = {}) {
  switch (options.platform || DEFAULT_PLATFORM) {
    case ETHEREUM: {
      return require('../web3Store').get().eth.Contract;
    }
    case KLAYTN: {
      return require('../caverStore').get().klay.Contract;
    }
    default:
      throw new Error('platform is not defined');
  }
};
