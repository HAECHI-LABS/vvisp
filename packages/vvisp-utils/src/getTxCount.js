module.exports = async function(target) {
  const web3 = require('./web3Store').get();
  if (web3.utils.isAddress(target)) {
    return web3.eth.getTransactionCount(target);
  } else {
    const privateKeyToAddress = require('./privateKeyToAddress');
    return web3.eth.getTransactionCount(privateKeyToAddress(target));
  }
};
