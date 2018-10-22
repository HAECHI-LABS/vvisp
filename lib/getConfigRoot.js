module.exports = async function(configFileName) {
  const findUp = require('find-up');
  const path = require('path');

  let configPath = await findUp([configFileName]);
  if (!configPath) {
    throw new Error(`${configFileName} is not found`);
  }

  return configPath.substring(0, configPath.lastIndexOf(path.sep));
};
