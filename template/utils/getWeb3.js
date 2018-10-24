module.exports = function() {
  require('dotenv').config();
  const Web3 = require('web3');

  let web3;

  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    if (process.env.NETWORK === 'local') {
      web3 = new Web3(new Web3(`http://localhost:${process.env.PORT}`));
    } else {
      web3 = new Web3(
        new Web3.providers.HttpProvider(
          `https://${process.env.NETWORK}.infura.io/${
            process.env.INFURA_API_KEY
          }`
        )
        // TODO: env 없으면 만들게 하는 것 => condition check
      );
    }
  }

  return web3;
};
