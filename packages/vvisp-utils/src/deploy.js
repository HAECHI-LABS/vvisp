module.exports = async function(
  { interface: abi, bytecode },
  privateKey,
  arguments,
  options
) {
  const filterPrivateKey = require('./utils/filterPrivateKey');
  privateKey = filterPrivateKey(privateKey);

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

  const sendTx = require('./sendTx');
  const web3 = require('./getWeb3')();

  const inputs = { data: '0x' + bytecode, arguments };
  const deployData = new web3.eth.Contract(abi).deploy(inputs).encodeABI();

  options = {
    ...options,
    data: deployData
  };

  return sendTx('0x', 0, privateKey, options);
};
