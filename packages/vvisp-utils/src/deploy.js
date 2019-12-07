module.exports = async function(
  { interface: abi, bytecode },
  from,
  arguments,
  options
) {
  const filterPrivateKey = require('./filterPrivateKey');
  const { getContractFactory } = require('./blockchainApis');
  from.privateKey = filterPrivateKey(from.privateKey);

  if (arguments && arguments.length === undefined) {
    // it means arguments is not array
    options = arguments;
    arguments = undefined;
  }
  abi = JSON.parse(abi);
  // Filtering arguments based on abi
  for (let i = 0; i < abi.length; i++) {
    if (abi[i].type === 'constructor') {
      const inputs = abi[i].inputs;
      if (arguments === undefined) {
        if (inputs.length > 0) {
          throw new Error(`Needs ${inputs.length}, but got 0`);
        } else {
          break;
        }
      }
      if (inputs.length !== arguments.length) {
        throw new Error(`Needs ${inputs.length}, but got ${arguments.length}`);
      }
      for (let j = 0; j < inputs.length; j++) {
        if (
          inputs[j].type.slice(-2) === '[]' &&
          typeof arguments[j] === 'string'
        ) {
          arguments[j] = JSON.parse(arguments[j]);
        }
      }
      break;
    }
  }

  const { sendTx } = require('./blockchainApis');
  const Contract = getContractFactory(options);

  const inputs = { data: '0x' + bytecode, arguments };
  const deployData = new Contract(abi).deploy(inputs).encodeABI();

  options = {
    ...options,
    data: deployData
  };

  return sendTx(null, 0, from, options);
};
