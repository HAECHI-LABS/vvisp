module.exports = async function(compileInformation, options) {
  const { compile, forIn } = require('@haechi-labs/vvisp-utils');
  const path = require('path');

  let compileFiles = [];
  forIn(compileInformation.targets, contract => {
    if (contract.path) {
      compileFiles.push(path.join('./', contract.path));
    }
  });

  return compile(compileFiles, options);
};
