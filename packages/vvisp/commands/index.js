const analyze = require('./analyze');
const compile = require('./compile');
const console = require('./console');
const coverage = require('./coverage')
const debug = require('./debug');
const deployContract = require('./deploy-contract');
const deployService = require('./deploy-service');
const flatten = require('./flatten');
const genScript = require('./gen-script.js');
const showState = require('./show-state');
const init = require('./init');


module.exports = [
  analyze,
  compile,
  console,
  coverage,
  debug,
  deployContract,
  deployService,
  flatten,
  genScript,
  init,
  showState
];
