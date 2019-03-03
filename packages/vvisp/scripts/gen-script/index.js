module.exports = async function(files = [], options) {
  const path = require('path');
  const _ = require('lodash');
  const fs = require('fs-extra');

  const { getAllFiles, printOrSilent } = require('@haechi-labs/vvisp-utils');
  const { getJsApis, render, rollingUp } = require('./utils');
  const generateApis = require('./generateApis');

  options = require('../utils/injectConfig')(options);

  const TEMPLATE = {
    backScript: path.join(__dirname, '../../template/script.mustache'),
    backIndex: path.join(__dirname, '../../template/index.mustache'),
    frontScript: path.join(__dirname, '../../template/front.mustache'),
    frontIndex: path.join(__dirname, '../../template/frontIndex.mustache')
  };

  if (files.length === 0) {
    files.push(path.join('./', 'contracts'));
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (fs.statSync(file).isDirectory()) {
      files = _.without(files, file);
      files = _.union(
        files,
        getAllFiles(file, filePath => {
          return path.parse(filePath).ext === '.sol';
        })
      );
    }
  }

  if (options.front) {
    await atFront(files, options);
  } else {
    await atBack(files, options);
  }

  async function atBack(files, options) {
    const { rootDir, abiDir, jsDir } = setDir('back');

    await generateApis(files, abiDir, jsDir, TEMPLATE.backScript, options);
    render(
      getJsApis(jsDir),
      path.join(rootDir, 'index.js'),
      TEMPLATE.backIndex
    );

    printOrSilent('\nGenerate Finished!', options);
  }

  async function atFront(files, options) {
    const { rootDir, abiDir, jsDir } = setDir('front');

    const name = options.front;

    await generateApis(files, abiDir, jsDir, TEMPLATE.frontScript, options);

    const apis = {
      name: name,
      ...getJsApis(jsDir)
    };

    render(apis, path.join(jsDir, name + '.js'), TEMPLATE.frontIndex);

    printOrSilent('\nGenerate Finished!\n', options);

    printOrSilent('Now Rollup Modules...', options);
    await rollingUp(rootDir, jsDir, name);
    printOrSilent('Rollup Finished!', options);
  }

  function setDir(dirName) {
    const rootDir = path.join(`./contractApis/${dirName}`);
    const abiDir = path.join(rootDir, 'abi');
    const jsDir = path.join(rootDir, 'js');

    fs.ensureDirSync(rootDir);
    fs.ensureDirSync(abiDir);
    fs.ensureDirSync(jsDir);

    return { rootDir, abiDir, jsDir };
  }
};
