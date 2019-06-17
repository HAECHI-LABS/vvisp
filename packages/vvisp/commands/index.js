const analyze = require('./analyze');
const ci = require('./ci');
const compile = require('./compile');
const console = require('./console');
const test = require('./test')
const debug = require('./debug');
const deployContract = require('./deploy-contract');
const deployService = require('./deploy-service');
const flatten = require('./flatten');
const genScript = require('./gen-script.js');
const showState = require('./show-state');
const init = require('./init');


module.exports = [
  analyze,
  ci,
  compile,
  console,
  debug,
  deployContract,
  deployService,
  flatten,
  genScript,
  init,
  showState,
  test
];
