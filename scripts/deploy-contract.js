module.exports = async function(file, arguments) {
  const { checkEnvExist } = require('../bin/error');
  checkEnvExist();

  const { compileAndDeploy, mnemonicToPrivateKey, getWeb3 } = require('../lib');
  const web3 = getWeb3();

  const privateKey = mnemonicToPrivateKey(
    process.env.MNEMONIC,
    process.env.PRIV_INDEX
  );

  const txOptions = {
    gasPrice: process.env.GAS_PRICE
      ? web3.utils.toHex(process.env.GAS_PRICE)
      : undefined
  };

  await compileAndDeploy(file, privateKey, arguments, txOptions);

  console.log('Deploying Finished!');
};
