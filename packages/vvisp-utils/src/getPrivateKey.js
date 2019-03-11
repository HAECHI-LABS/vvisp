module.exports = function(mnemonic, index) {
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
    if (typeof mnemonic !== 'string') {
      throw new TypeError(
        `Input mnemonic is ${mnemonic}, it should be string type`
      );
    }
    switch (index) {
      case undefined || null:
        throw new TypeError(`Input index is ${index}`);
      default:
        if (typeof index !== typeof 1) {
          if (typeof index === 'string') {
            if (isNaN(parseInt(index))) {
              throw new TypeError(`Invalid index, ${index}`);
            }
          } else {
            throw new TypeError('Input index should be number');
          }
        }
    }
  }
};
