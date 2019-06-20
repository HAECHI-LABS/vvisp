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

const { Haechi } = require('./contractApis/back')(config, webSetter);

main();

async function main() {
  // Haechi_ADDRESS is a address of Haechi contract
  const haechi = new HaechiV1('Haechi_ADDRESS');

  // call the run method in the Haechi contract
  const receipt = await haechi.methods.run();
  console.log(receipt);
}
