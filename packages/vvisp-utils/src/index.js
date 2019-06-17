const compile = require('./compile');
const compileAndDeploy = require('./compileAndDeploy');
const compilerSupplier = require('./compilerSupplier');
const Config = require('./Config');
const deploy = require('./deploy');
const filterPrivateKey = require('./filterPrivateKey');
const findImportPath = require('./findImportPath');
const forIn = require('./forIn');
const forInAsync = require('./forInAsync');
const getAllFiles = require('./getAllFiles');
const getCompiledContracts = require('./getCompiledContracts');
const getCycle = require('./getCycle');
const blockchainApis = require('./blockchainApis');
const web3Store = require('./web3Store');
const getPrivateKey = require('./getPrivateKey');
const printOrSilent = require('./printOrSilent');
const getConfigRoot = require('./getConfigRoot');
const getRelativeFilePathsFromRoot = require('./getRelativeFilePathsFromRoot');
const getDependencyFiles = require('./getDependencyFiles');
const getSourceCodeWithoutPragma = require('./getSourceCodeWithoutPragma');
const getMaxVersion = require('./getPragmaMaxVersion');
const parseLogs = require('./parseLogs');

module.exports = {
  ...blockchainApis,
  compile,
  compileAndDeploy,
  compilerSupplier,
  Config,
  deploy,
  filterPrivateKey,
  findImportPath,
  forIn,
  forInAsync,
  getAllFiles,
  getCompiledContracts,
  getCycle,
  web3Store,
  getPrivateKey,
  printOrSilent,
  getConfigRoot,
  getRelativeFilePathsFromRoot,
  getDependencyFiles,
  getSourceCodeWithoutPragma,
  getMaxVersion,
  parseLogs
};
