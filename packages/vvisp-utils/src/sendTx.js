module.exports = async function(_toAddr, _value, _privKey, options) {
  const Tx = require('ethereumjs-tx');
  const web3 = require('./getWeb3')();
  const privateKeyToAddress = require('./privateKeyToAddress');
  const printOrSilent = require('./printOrSilent');

  return main(_toAddr, _value, _privKey, options);

  async function main(_toAddr, _value, _privKey, options) {
    const fromAddr = privateKeyToAddress(_privKey);
    const txCount =
      options.txCount || (await web3.eth.getTransactionCount(fromAddr));

    // construct the transaction data
    const txData = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: options.gasLimit || web3.utils.toHex(4600000), // TODO: mv to config file
      gasPrice: options.gasPrice || web3.utils.toHex(10e9),
      to: _toAddr,
      from: fromAddr,
      value: _value || '0x',
      data: options.data || '0x'
    };

    return sendSigned(txData, _privKey);
  }

  async function sendSigned(txData, privKey) {
    if (typeof privKey === 'string' && privKey.slice(0, 2) === '0x') {
      privKey = privKey.slice(2);
    }
    const privateKey = Buffer.from(privKey, 'hex');
    const transaction = new Tx(txData);
    transaction.sign(privateKey);
    const serializedTx = transaction.serialize().toString('hex');

    return web3.eth
      .sendSignedTransaction('0x' + serializedTx)
      .on('error', function(error) {
        printOrSilent(error, options);
      });
  }
};
