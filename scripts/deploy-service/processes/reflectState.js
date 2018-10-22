module.exports = function(deployState, options) {
  const { CONSTRUCTOR, INITIALIZE } = require('../constants');
  const { forIn } = require('../../../lib/index');
  const { writeState } = require('../utils/index');

  const stateClone = deployState.getState();

  forIn(stateClone.contracts, contract => {
    delete contract[CONSTRUCTOR];
    delete contract.childNode;
    delete contract.parentNode;
    delete contract[INITIALIZE];
    delete contract.path;
  });
  delete stateClone.paused;
  delete stateClone.notUpgrading;
  writeState(stateClone, options);
};
