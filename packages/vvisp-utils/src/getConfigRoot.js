module.exports = function(configFileName) {
  const findUp = require('find-up');
  const path = require('path');

  let configPath = findUp.sync([configFileName]);
  if (!configPath) {
    throw new Error(`${configFileName} is not found`);
  }

  return configPath.substring(0, configPath.lastIndexOf(path.sep));
};
