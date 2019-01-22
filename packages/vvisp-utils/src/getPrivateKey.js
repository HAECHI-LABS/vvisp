module.exports = function(mnemonic, index) {
  if (process.env.PRIVATE_KEY) {
    if (process.env.PRIVATE_KEY.slice(0, 2) === '0x')
      return process.env.PRIVATE_KEY.slice(2);
    else return process.env.PRIVATE_KEY;
  }
  if (!index) {
    index = 0;
  }
  checkInputs(mnemonic, index);

  const bip39 = require('bip39');
  const hdkey = require('ethereumjs-wallet/hdkey');

  const _path = `m/44'/60'/0'/0/${index}`;

  return hdkey
    .fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
    .derivePath(_path)
    .getWallet()
    .getPrivateKey()
    .toString('hex');

  function checkInputs(mnemonic, index) {
    switch (mnemonic) {
      case undefined || null:
        throw new TypeError(`Input mnemonic is ${mnemonic}`);
      default:
        if (typeof mnemonic !== 'string') {
          throw new TypeError('Input 12 words in string type');
        } else {
          const wordsNumber = mnemonic.split(' ').length;
          if (wordsNumber !== 12) {
            throw new TypeError('Input 12 words, not ' + wordsNumber);
          }
        }
    }
    if (typeof index !== typeof 1) {
      throw new TypeError('Input index should be number');
    }
  }
};
