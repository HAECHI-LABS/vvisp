module.exports = async function(files, abiDir, jsDir, templatePath, options) {
  const { abiMaker, injectInputName, render } = require('./utils');
  const path = require('path');
  const fs = require('fs-extra');
  const { compile } = require('@haechi-labs/vvisp-utils');

  const output = await compile(files, options);

  const compileOutputKeys = Object.keys(output.contracts);
  let compileInfos = {};

  for (const compileOutputKey of compileOutputKeys) {
    const splits = compileOutputKey.split(':');
    const filePath = splits[0];
    if (!compileInfos[filePath]) {
      compileInfos[filePath] = [];
    }
    compileInfos[filePath].push(splits[1]);
  }

  for (const filePath of files) {
    for (const contractName of compileInfos[filePath]) {
      let abi;
      try {
        abi = output.contracts[filePath + ':' + contractName].interface;
      } catch (e) {
        continue;
      }

      const jsonPath = path.join(abiDir, contractName + '.json');
      const jsPath = path.join(jsDir, contractName + '.js');

      fs.writeFileSync(jsonPath, abi);

      const contract = abiMaker(jsonPath);

      render(injectInputName(contract), jsPath, templatePath);
    }
  }
};
