const compile = require('./compile');
const console = require('./console');
const debug = require('./debug');
const deployContract = require('./deploy-contract');
const deployService = require('./deploy-service');
const flatten = require('./flatten');
const genScript = require('./gen-script.js');
const init = require('./init');
const showState = require('./show-state');

module.exports = [
  compile,
  console,
  deployContract,
  deployService,
  flatten,
  genScript,
  init,
  showState
];
