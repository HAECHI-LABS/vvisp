module.exports = async function(contracts, options) {
  const { compile, forIn } = require('@haechi-labs/haechi-utils');
  const path = require('path');
  const { PROXY_PATH, REGISTRY_PATH } = require('../constants');

  let compileFiles = [];
  compileFiles.push(PROXY_PATH);
  compileFiles.push(REGISTRY_PATH);

  forIn(contracts, contract => {
    if (contract.path) {
      compileFiles.push(path.join('./', contract.path));
    }
  });

  return compile(compileFiles, options ? options.silent : undefined);
};
