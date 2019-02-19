module.exports = function(privateKey) {
  if (privateKey === undefined || null) {
    throw new TypeError(`Input privateKey is ${privateKey}`);
  } else if (typeof privateKey === 'string') {
    if (privateKey[0] + privateKey[1] !== '0x') {
      privateKey = '0x' + privateKey;
    }
    if (privateKey.length !== 66) {
      throw new TypeError(`Input privateKey has wrong length`);
    }
  } else if (Buffer.isBuffer(privateKey)) {
    if (privateKey.length === 32) {
      privateKey = '0x' + privateKey.toString('hex');
    } else if (privateKey.length === 64) {
      privateKey = '0x' + privateKey.toString();
    } else {
      throw new TypeError(
        'Wrong Buffer length! Expected 32 or 64 instead of ' + privateKey.length
      );
    }
  } else {
    throw new TypeError('Wrong Type! privateKey should be string or Buffer');
  }
  return privateKey;
};
