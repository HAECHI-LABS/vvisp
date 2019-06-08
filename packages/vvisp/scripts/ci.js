const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { printOrSilent } = require('@haechi-labs/vvisp-utils');
const test = require('./test');
const deployService = require('./deploy-service');
const analyze = require('./analyze');
const constants = require('../config/Constant');

module.exports = async function(options) {
  options = require('./utils/injectConfig')(options);

  printOrSilent('Testing...', options);
  await test({silent: true});
  printOrSilent('Testing... OK', options);

  printOrSilent('Analyzing...', options);
  await analyze([], {silent: true, allContract: true});
  printOrSilent('Analyzing... OK', options);

  printOrSilent('Deploying...', options);
  if (options.reset) {
    fs.unlinkSync(constants.STATE_PATH);
  }
  await deployService({silent: true});
  printOrSilent('Deploying... OK', options);
};
