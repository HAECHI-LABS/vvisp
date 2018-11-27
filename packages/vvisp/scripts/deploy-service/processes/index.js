const deployBusinesses = require('./deployBusinesses');
const deployNonUpgradeables = require('./deployNonUpgradeables');
const deployProxies = require('./deployProxies');
const deployRegistry = require('./deployRegistry');
const initNonUpgradeables = require('./initNonUpgradeables');
const injectVar = require('./injectVar');
const reflectState = require('./reflectState');
const registerFileNames = require('./registerFileNames');
const upgradeAll = require('./upgradeAll');

module.exports = {
  deployBusinesses,
  deployNonUpgradeables,
  deployProxies,
  deployRegistry,
  initNonUpgradeables,
  injectVar,
  reflectState,
  registerFileNames,
  upgradeAll
};
