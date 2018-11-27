module.exports = async function(target) {
  const web3 = require('./getWeb3')();
  if (web3.utils.isAddress(target)) {
    return web3.eth.getTransactionCount(target);
  } else {
    const privateKeyToAddress = require('./privateKeyToAddress');
    return web3.eth.getTransactionCount(privateKeyToAddress(target));
  }
};
