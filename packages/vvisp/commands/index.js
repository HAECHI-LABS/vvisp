const compile = require('./compile');
const console = require('./console');
const test = require('./test');
const deployContract = require('./deploy-contract');
const deployService = require('./deploy-service');
const flatten = require('./flatten');
const genScript = require('./gen-script.js');
const init = require('./init');

module.exports = [
  compile,
  console,
  deployContract,
  deployService,
  flatten,
  genScript,
  init,
  test
];
