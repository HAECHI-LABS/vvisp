module.exports = async function(file, arguments, options) {
  const { checkEnv } = require('../bin/error');
  checkEnv();

  const {
    compileAndDeploy,
    getPrivateKey,
    getWeb3,
    printOrSilent
  } = require('@haechi-labs/vvisp-utils');
  const web3 = getWeb3();

  const privateKey = getPrivateKey(
    process.env.MNEMONIC,
    process.env.PRIV_INDEX
  );

  const txOptions = {
    ...options,
    gasPrice: process.env.GAS_PRICE
      ? web3.utils.toHex(process.env.GAS_PRICE)
      : undefined,
    gasLimit: process.env.GAS_LIMIT
      ? web3.utils.toHex(process.env.GAS_LIMIT)
      : undefined
  };

  await compileAndDeploy(file, privateKey, arguments, txOptions);

  printOrSilent('Deploying Finished!', options);
};
