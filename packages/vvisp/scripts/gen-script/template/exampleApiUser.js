// You can give configuration arguments like below.

/*
  If you described vvisp-config.json already, you don't have to give below arguments.
 */

const config = {
  from: 'PRIVATE_KEY',
  gasPrice: GAS_PRICE,
  gasLimit: GAS_LIMIT
};
// Write url or make provider object
const webSetter = 'URL_OR_PROVIDER';
/*
  If you described vvisp-config.json already, you don't have to give above arguments.
 */

const { ContractA } = require('./contractApis/back')(config, webSetter);

main();

async function main() {
  // ContractA_ADDRESS is a address of ContractA contract
  const contractA = new ContractA('ContractA_ADDRESS');

  // call the run method in the ContractA contract
  const receipt = await contractA.methods.run();
  console.log(receipt);
}
