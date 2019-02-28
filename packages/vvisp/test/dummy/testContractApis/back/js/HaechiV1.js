const path = require('path');
const { Config, web3Store, sendTx } = require('@haechi-labs/vvisp-utils');
const config = Config.get();
const web3 = web3Store.get();
const fs = require('fs');

const privateKey = config.from;

const abi = fs.readFileSync(path.join(__dirname, '../abi/', 'HaechiV1.json'), {
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
      velocities: function(_input1) {
        return contract.methods.velocities(_input1).call();
      },
      haechiIds: function(_input1) {
        return contract.methods.haechiIds(_input1).call();
      },
      distances: function(_input1) {
        return contract.methods.distances(_input1).call();
      },
      gym: function() {
        return contract.methods.gym().call();
      },
      makeNewHaechi: function(__id, options) {
        const txData = contract.methods.makeNewHaechi(__id).encodeABI();
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
      increaseVelocity: function(__haechiId, __diff, options) {
        const txData = contract.methods
          .increaseVelocity(__haechiId, __diff)
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
      run: function(options) {
        const txData = contract.methods.run().encodeABI();
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
      initialize: function(__gym, options) {
        const txData = contract.methods.initialize(__gym).encodeABI();
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
