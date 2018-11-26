module.exports = async function(
  { interface: abi, bytecode },
  privateKey,
  arguments,
  options
) {
  if (arguments && arguments.length === undefined) {
    // it means arguments is not array
    options = arguments;
    arguments = undefined;
  }

  const sendTx = require('./sendTx');
  const web3 = require('./getWeb3')();

  const inputs = { data: '0x' + bytecode, arguments };
  const deployData = new web3.eth.Contract(JSON.parse(abi))
    .deploy(inputs)
    .encodeABI();

  options = {
    ...options,
    data: deployData
  };

  return sendTx('0x', 0, privateKey, options);
};
