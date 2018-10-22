module.exports = function(contract) {
  const { CONSTRUCTOR } = require('../constants');
  return contract[CONSTRUCTOR] && contract[CONSTRUCTOR].length > 0;
};
