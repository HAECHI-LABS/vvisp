module.exports = function(mnemonic, index) {
  const bip39 = require('bip39');
  const hdkey = require('ethereumjs-wallet/hdkey');

  if (!index) {
    index = '0';
  }

  const _path = `m/44'/60'/0'/0/${index}`;

  return hdkey
    .fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
    .derivePath(_path)
    .getWallet()
    .getPrivateKey()
    .toString('hex');
};
