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

const abi = fs.readFileSync(path.join(__dirname, '../abi/', 'MainToken.json'), {
  encoding: 'utf8'
});

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
      mintingFinished: function() {
        return contract.methods.mintingFinished().call();
      },
      name: function() {
        return contract.methods.name().call();
      },
      isLock: function() {
        return contract.methods.isLock().call();
      },
      totalSupply: function() {
        return contract.methods.totalSupply().call();
      },
      isTransferable: function(_addr) {
        return contract.methods.isTransferable(_addr).call();
      },
      decimals: function() {
        return contract.methods.decimals().call();
      },
      paused: function() {
        return contract.methods.paused().call();
      },
      balanceOf: function(__owner) {
        return contract.methods.balanceOf(__owner).call();
      },
      owner: function() {
        return contract.methods.owner().call();
      },
      symbol: function() {
        return contract.methods.symbol().call();
      },
      transferableAddresses: function(_input1) {
        return contract.methods.transferableAddresses(_input1).call();
      },
      allowance: function(__owner, __spender) {
        return contract.methods.allowance(__owner, __spender).call();
      },
      freezeAddresses: function(_input1) {
        return contract.methods.freezeAddresses(_input1).call();
      },
      approve: function(__spender, __value, options) {
        const txData = contract.methods.approve(__spender, __value).encodeABI();
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
      addFreezableAddress: function(_addr, options) {
        const txData = contract.methods.addFreezableAddress(_addr).encodeABI();
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
      transferFrom: function(__from, __to, __value, options) {
        const txData = contract.methods
          .transferFrom(__from, __to, __value)
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
      removeFreezableAddress: function(_addr, options) {
        const txData = contract.methods
          .removeFreezableAddress(_addr)
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
      addTransferableAddresses: function(_addrs, options) {
        const txData = contract.methods
          .addTransferableAddresses(_addrs)
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
      addTransferableAddress: function(_addr, options) {
        const txData = contract.methods
          .addTransferableAddress(_addr)
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
      unpause: function(options) {
        const txData = contract.methods.unpause().encodeABI();
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
      mint: function(__to, __amount, options) {
        const txData = contract.methods.mint(__to, __amount).encodeABI();
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
      burn: function(__value, options) {
        const txData = contract.methods.burn(__value).encodeABI();
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
      addFreezableAddresses: function(_addrs, options) {
        const txData = contract.methods
          .addFreezableAddresses(_addrs)
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
      removeTransferableAddresses: function(_addrs, options) {
        const txData = contract.methods
          .removeTransferableAddresses(_addrs)
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
      decreaseApproval: function(__spender, __subtractedValue, options) {
        const txData = contract.methods
          .decreaseApproval(__spender, __subtractedValue)
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
      finishMinting: function(options) {
        const txData = contract.methods.finishMinting().encodeABI();
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
      pause: function(options) {
        const txData = contract.methods.pause().encodeABI();
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
      unlock: function(options) {
        const txData = contract.methods.unlock().encodeABI();
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
      transfer: function(__to, __value, options) {
        const txData = contract.methods.transfer(__to, __value).encodeABI();
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
      increaseApproval: function(__spender, __addedValue, options) {
        const txData = contract.methods
          .increaseApproval(__spender, __addedValue)
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
      removeTransferableAddress: function(_addr, options) {
        const txData = contract.methods
          .removeTransferableAddress(_addr)
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
      },
      removeFreezableAddresses: function(_addrs, options) {
        const txData = contract.methods
          .removeFreezableAddresses(_addrs)
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
