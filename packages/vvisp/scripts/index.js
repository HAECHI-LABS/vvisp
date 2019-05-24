const genScript = require('./gen-script');
const compile = require('./compile');
const deployService = require('./deploy-service');
const deployContract = require('./deploy-contract');
const init = require('./init');
const flatten = require('./flatten');
const console = require('./console');
const coverage = require('./coverage');

module.exports = {
  genScript,
  compile,
  deployService,
  deployContract,
  init,
  flatten,
  console,
  coverage
};
