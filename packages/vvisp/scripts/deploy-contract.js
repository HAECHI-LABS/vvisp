module.exports = async function(file, arguments, options) {
  options = require('./utils/injectConfig')(options);

  const path = require('path');
  const {
    compile,
    deploy,
    getSTDInput,
    printOrSilent
  } = require('@haechi-labs/vvisp-utils');

  const privateKey = options.config.from;

  options = {
    ...options,
    gasPrice: options.config.gasPrice,
    gasLimit: options.config.gasLimit
  };

  arguments = arguments.map(arg => {
    // convert array string to array
    // "[0x123, 0x234]" to ["0x123", "0x234"]
    if (arg.startsWith('[') && arg.endsWith(']')) {
      return arg
        .slice(1, arg.length - 1)
        .split(/\s*,\s*/)
        .map(v => {
          // remove empty space for each element
          return v.trim();
        });
    }
    return arg;
  });

  const output = await compile(file, options);

  const compileOutputKeys = Object.keys(output.contracts);
  const contractCandidates = [];
  for (const compileOutputKey of compileOutputKeys) {
    const splits = compileOutputKey.split(':');
    if (path.join(splits[0]) === path.join(file)) {
      contractCandidates.push(splits[1]);
    }
  }

  let targetContractName;
  if (contractCandidates.length > 1) {
    let question = '\nSelect the number of the contract you want to deploy\n';
    for (let i = 0; i < contractCandidates.length; i++) {
      question += `${i + 1}. ${contractCandidates[i]}\n`;
    }
    question += `\nNumber(1 ~ ${contractCandidates.length}): `;
    let index;
    while (1) {
      index = parseInt(await getSTDInput(question));
      if (
        typeof index !== 'number' ||
        index < 1 ||
        index > contractCandidates.length
      ) {
        console.log(
          'Input Type Wrong, please choose the number between 0 ~ ' +
            contractCandidates.length
        );
        continue;
      }
      break;
    }
    targetContractName = contractCandidates[index - 1];
  } else {
    targetContractName = contractCandidates[0];
  }

  const deployTarget = output.contracts[file + ':' + targetContractName];

  printOrSilent('Deploying ' + targetContractName + '...', options);
  const receipt = await deploy(deployTarget, privateKey, arguments, options);

  printOrSilent(targetContractName + ' Contract Created!', options);
  printOrSilent('Contract Address: ' + receipt.contractAddress, options);

  printOrSilent('Deployment Finished!', options);
  process.exit();
};
