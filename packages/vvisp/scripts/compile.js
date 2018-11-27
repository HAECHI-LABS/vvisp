module.exports = async function(files, options) {
  const path = require('path');
  const fs = require('fs-extra');
  const {
    compile,
    getAllFiles,
    printOrSilent
  } = require('@haechi-labs/vvisp-utils');

  fs.ensureDirSync(path.join('./', 'build'));
  fs.ensureDirSync(path.join('build', 'contracts'));

  if (files.length === 0) {
    files = getAllFiles(path.join('./', 'contracts'));
  }

  const output = await compile(files, options ? options.silent : undefined);

  const contractNames = Object.keys(output.contracts);
  const contractContents = Object.values(output.contracts);

  for (let i = 0; i < contractNames.length; i++) {
    const contractName = path.parse(contractNames[i]).name;
    contractContents[i].contractName = contractName;
    fs.writeJsonSync(
      path.join('./build/contracts/', contractName + '.json'),
      JSON.stringify(contractContents[i], null, '  ')
    );
  }
  printOrSilent('Compiling Finished!', options);
};
