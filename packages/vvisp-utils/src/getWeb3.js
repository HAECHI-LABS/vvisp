module.exports = function() {
  const Web3 = require('web3');

  let url;

  if (process.env.NETWORK === 'local') {
    url = `http://localhost:${process.env.PORT}`;
  } else if (process.env.NETWORK === 'custom') {
    url = process.env.URL;
  } else {
    url = `https://${process.env.NETWORK}.infura.io/${
      process.env.INFURA_API_KEY
    }`;
  }
  const web3 = new Web3(new Web3.providers.HttpProvider(url));

  return web3;
};
