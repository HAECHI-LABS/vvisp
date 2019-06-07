const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');
const { printOrSilent } = require('@haechi-labs/vvisp-utils');
const test = require('./coverage');
const deployService = require('./deploy-service');
const analyze = require('./analyze');
const constants = require('../config/Constant');

module.exports = async function(options) {
  options = require('./utils/injectConfig')(options);

  let spinner = ora('Testing...').start();

  try {
    await test({silent: true});
    spinner.succeed();
  } catch {
    spinner.fail();
  }

  spinner = ora('Analyzing...').start();
  try {
    await analyze([], {silent: true, allContract: true});
    spinner.succeed();
  } catch {
    spinner.fail();
  }

  spinner = ora('Deploying...').start();
  try {
    if (options.reset) {
      fs.unlinkSync(constants.STATE_PATH);
    }
    await deployService({silent: true});
    spinner.succeed();
  } catch {
    spinner.fail();
  }
};
