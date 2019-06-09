const Web3 = require('web3');

let web3;
module.exports = (function() {
  return {
    /**
    @dev setWithProvider set web3 with provider
     */
    setWithProvider: provider => {
      web3 = new Web3(provider);
    },
    /**
    @dev setWithURL set web3 with http url
     */
    setWithURL: url => {
      web3 = new Web3(new Web3.providers.HttpProvider(url));
    },
    /**
    @dev get getter of stored web3, if there isn't, return void web3
     */
    get: () => {
      if (!web3) {
        return new Web3();
      }
      return web3;
    },
    /**
    @dev delete delete stored web3 for test
     */
    delete: () => {
      web3 = undefined;
    }
  };
})();
