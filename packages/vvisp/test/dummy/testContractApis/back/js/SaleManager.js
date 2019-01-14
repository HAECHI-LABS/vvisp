const path = require('path');
const {
  getWeb3,
  mnemonicToPrivateKey,
  sendTx
} = require('@haechi-labs/vvisp-utils');
const web3 = getWeb3();
const fs = require('fs');

const privateKey = mnemonicToPrivateKey(
  process.env.MNEMONIC,
  process.env.PRIV_INDEX
);

const abi = fs.readFileSync(
  path.join(__dirname, '../abi/', 'SaleManager.json'),
  { encoding: 'utf8' }
);

module.exports = function(_contractAddr = '') {
  const contract = new web3.eth.Contract(JSON.parse(abi));
  contract.options.address = _contractAddr;
  return {
    at: function(_addr) {
      contract.options.address = _addr;
    },
    getAddress: function() {
      return contract.options.address;
    },
    methods: {
      owner: function() {
        return contract.methods.owner().call();
      },
      whitelistAddress: function() {
        return contract.methods.whitelistAddress().call();
      },
      token: function() {
        return contract.methods.token().call();
      },
      createWhitelist: function(options) {
        const txData = contract.methods.createWhitelist().encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(
          contract.options.address,
          options ? options.value : 0,
          privateKey,
          options
        );
      },
      createTokenSale: function(
        _fundWallet,
        _hardCap,
        _rate,
        _openingTime,
        _closingTime,
        _minEth,
        _maxEth,
        options
      ) {
        const txData = contract.methods
          .createTokenSale(
            _fundWallet,
            _hardCap,
            _rate,
            _openingTime,
            _closingTime,
            _minEth,
            _maxEth
          )
          .encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(
          contract.options.address,
          options ? options.value : 0,
          privateKey,
          options
        );
      },
      renounceOwnership: function(options) {
        const txData = contract.methods.renounceOwnership().encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(
          contract.options.address,
          options ? options.value : 0,
          privateKey,
          options
        );
      },
      transferOwnership: function(_newOwner, options) {
        const txData = contract.methods
          .transferOwnership(_newOwner)
          .encodeABI();
        options = {
          ...options,
          data: txData
        };
        return sendTx(
          contract.options.address,
          options ? options.value : 0,
          privateKey,
          options
        );
      }
    }
  };
};
