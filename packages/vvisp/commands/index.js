const compile = require('./compile');
const console = require('./console');
const deployContract = require('./deploy-contract');
const deployService = require('./deploy-service');
const flatten = require('./flatten');
const genScript = require('./gen-script.js');
const debug = require('./debug');
const init = require('./init');

module.exports = [
  compile,
  console,
  deployContract,
  deployService,
  flatten,
  genScript,
  debug,
  init
];
