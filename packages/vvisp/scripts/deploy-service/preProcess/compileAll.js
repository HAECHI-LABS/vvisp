module.exports = async function(compileInformation, options) {
  const { compile, forIn } = require('@haechi-labs/vvisp-utils');
  const path = require('path');
  const { PROXY_PATH, REGISTRY_PATH } = require('../constants');

  let compileFiles = [];
  if (compileInformation.noProxy !== true) {
    compileFiles.push(PROXY_PATH);
  }
  if (compileInformation.noRegistry !== true) {
    compileFiles.push(REGISTRY_PATH);
  }

  forIn(compileInformation.targets, contract => {
    if (contract.path) {
      compileFiles.push(path.join('./', contract.path));
    }
  });

  return compile(compileFiles, options);
};
