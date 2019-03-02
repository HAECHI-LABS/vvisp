module.exports = function(contract) {
  const { INITIALIZE } = require('../constants');
  return contract[INITIALIZE] && contract[INITIALIZE].functionName;
};
