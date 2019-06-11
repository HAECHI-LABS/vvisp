const path = require('path');
const {
  Config,
  getContractFactory,
  sendTx
} = require('@haechi-labs/vvisp-utils');
const fs = require('fs');

let abi;

module.exports = function(_contractAddr = '') {
  abi = fs.readFileSync(path.join(__dirname, '../abi/', 'HaechiV1.json'), {
    encoding: 'utf8'
  });

  const platform = Config.get().platform;
  const Contract = getContractFactory({ platform: platform });
  const contract = new Contract(JSON.parse(abi));
  contract.options.address = _contractAddr;
  return {
    at: function(_addr) {
      contract.options.address = _addr;
    },
    getAddress: function() {
      return contract.options.address;
    },
    methods: {
      velocities: function(input1) {
        return contract.methods.velocities(input1).call();
      },
      haechiIds: function(input1) {
        return contract.methods.haechiIds(input1).call();
      },
      distances: function(input1) {
        return contract.methods.distances(input1).call();
      },
      gym: function() {
        return contract.methods.gym().call();
      },
      makeNewHaechi: function(_id, options) {
        const txData = contract.methods.makeNewHaechi(_id).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(
          contract.options.address,
          options ? options.value : 0,
          loadPrivateKey(),
          options
        );
      },
      increaseVelocity: function(_haechiId, _diff, options) {
        const txData = contract.methods
          .increaseVelocity(_haechiId, _diff)
          .encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(
          contract.options.address,
          options ? options.value : 0,
          loadPrivateKey(),
          options
        );
      },
      run: function(options) {
        const txData = contract.methods.run().encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(
          contract.options.address,
          options ? options.value : 0,
          loadPrivateKey(),
          options
        );
      },
      initialize: function(_gym, options) {
        const txData = contract.methods.initialize(_gym).encodeABI();
        options = {
          ...options,
          data: txData,
          platform: platform
        };
        return sendTx(
          contract.options.address,
          options ? options.value : 0,
          loadPrivateKey(),
          options
        );
      }
    }
  };
};

function loadPrivateKey() {
  return Config.get().from;
}
