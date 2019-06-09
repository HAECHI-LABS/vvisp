const Caver = require('caver-js');

let caver;
module.exports = (function() {
  return {
    /**
    @dev setWithProvider set caver with provider
     */
    setWithProvider: provider => {
      caver = new Caver(provider);
    },
    /**
    @dev setWithURL set caver with http url
     */
    setWithURL: url => {
      caver = new Caver(url);
    },
    /**
    @dev get getter of stored caver, if there isn't, return void caver
     */
    get: () => {
      if (!caver) {
        return new Caver();
      }
      return caver;
    },
    /**
    @dev delete delete stored caver for test
     */
    delete: () => {
      caver = undefined;
    }
  };
})();
