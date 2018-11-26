module.exports = async function(files, abiDir, jsDir, templatePath, options) {
  const { abiMaker, injectInputName, render } = require('./utils');
  const path = require('path');
  const fs = require('fs-extra');
  const { compile } = require('@haechi-labs/haechi-utils');

  const output = await compile(files, options ? options.silent : undefined); // TODO: get all files if it is directory

  for (let i = 0; i < files.length; i++) {
    const className = path.parse(files[i]).name;
    const abi = output.contracts[files[i] + ':' + className].interface;

    const jsonPath = path.join(abiDir, className + '.json');
    const jsPath = path.join(jsDir, className + '.js');

    fs.writeFileSync(jsonPath, abi);

    const contract = abiMaker(jsonPath);

    render(injectInputName(contract), jsPath, templatePath);
  }
};
