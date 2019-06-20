// Do not change `host` and `port` of local_eth_ganache option if you need to run `npm run test`
module.exports = {
  local_eth_ganache: {
    host: 'localhost',
    port: 8545,
    network_id: '*' // eslint-disable-line camelcase
  }
};
