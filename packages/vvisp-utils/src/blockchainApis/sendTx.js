const { DEFAULT_PLATFORM, ETHEREUM, KLAYTN } = require('../../constants');

module.exports = async function(_toAddr, _value, _from, options) {
  const privateKeyToAddress = require('./privateKeyToAddress');
  const getTxCount = require('./getTxCount');

  const DEFAULT_GAS_LIMIT = 6721975;
  const DEFAULT_GAS_PRICE = 10e9;

  return main(_toAddr, _value, _from, options);

  async function main(_toAddr, _value, _from, options) {
    const fromAddr = _from.address; //privateKeyToAddress(_from.privateKey, options);
    const txCount = options.txCount || (await getTxCount(fromAddr, options));

    // construct the transaction data
    const txData = {
      nonce: txCount,
      gasLimit: options.gasLimit || '0x' + DEFAULT_GAS_LIMIT.toString(16),
      gasPrice: options.gasPrice || '0x' + DEFAULT_GAS_PRICE.toString(16),
      to: _toAddr,
      from: fromAddr,
      value: _value || '0x',
      data: options.data || '0x'
    };

    //TODO: change to get external signer
    return sendSigned(txData, _from.privateKey, options);
  }

  async function sendSigned(txData, privKey, options) {
    if (typeof privKey === 'string' && privKey.slice(0, 2) === '0x') {
      privKey = privKey.slice(2);
    }

    switch (options.platform || DEFAULT_PLATFORM) {
      case ETHEREUM: {
        const Tx = require('ethereumjs-tx');
        const web3 = require('../web3Store').get();

        const transaction = new Tx(txData);
        const privateKey = Buffer.from(privKey, 'hex');
        transaction.sign(privateKey);
        const serializedTx = transaction.serialize().toString('hex');

        return web3.eth.sendSignedTransaction('0x' + serializedTx);
      }
      case KLAYTN: {
        const caver = require('../caverStore').get();

        const { rawTransaction } = await caver.klay.accounts.signTransaction(
          txData,
          '0x' + privKey
        );
        return caver.klay.sendSignedTransaction(rawTransaction);
      }
      default:
        throw new Error('platform is not defined');
    }
  }
};
