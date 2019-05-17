const compile = require('./compile');
const console = require('./console');
const debug = require('./debug');
const deployContract = require('./deploy-contract');
const deployService = require('./deploy-service');
const flatten = require('./flatten');
const genScript = require('./gen-script.js');
const showState = require('./show-state');
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
