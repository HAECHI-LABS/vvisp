module.exports = async function(files, options) {
  options = require('./utils/injectConfig')(options);
  debug = require('./debug/debugger');

  const path = require('path');
  const fs = require('fs-extra');
  const { getAllFiles, printOrSilent } = require('@haechi-labs/vvisp-utils');

  fs.ensureDirSync(path.join('./', 'build'));
  fs.ensureDirSync(path.join('build', 'contracts'));

  if (files.length === 0) {
    files = getAllFiles(path.join('./', 'contracts'), filePath => {
      return path.parse(filePath).ext === '.sol';
    });
  }

  const output = await debug(files, options);

  Object.entries(output.contracts).forEach(
    ([contractNamePath, contractContent]) => {
      const contractName = path.parse(contractNamePath).name;
      contractContent.contractName = contractName;
      fs.writeJsonSync(
        path.join('./build/contracts', contractName + '.json'),
        contractContent,
        { spaces: '  ' }
      );
    }
  );
  printOrSilent('Debugging . . . ', options);
};
