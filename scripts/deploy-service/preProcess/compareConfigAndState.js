module.exports = function(configContracts, stateClone) {
  const path = require('path');
  const { forIn } = require('../../../lib/index');

  const { PENDING_STATE } = require('../constants');
  const targets = {};

  if (stateClone.notUpgrading) {
    forIn(configContracts, (contract, name) => {
      if (!stateClone.paused) {
        stateClone.contracts[name] = { pending: PENDING_STATE[0], ...contract };
      }
      targets[name] = { ...stateClone.contracts[name] };
    });
    return targets;
  }

  if (!stateClone.paused) {
    forIn(configContracts, (contract, name) => {
      if (!stateClone.contracts.hasOwnProperty(name)) {
        // deploy
        stateClone.contracts[name] = { pending: PENDING_STATE[0], ...contract };
        targets[name] = { ...stateClone.contracts[name] };
      } else if (
        path.parse(contract.path).name !==
        stateClone.contracts[name].fileName.slice(0, -4)
      ) {
        // other contracts
        stateClone.contracts[name] = {
          ...stateClone.contracts[name],
          pending: PENDING_STATE[1],
          ...contract
        };
        targets[name] = { ...stateClone.contracts[name] };
      }
    });
  } else {
    forIn(stateClone.contracts, (contract, name) => {
      if (contract.pending === PENDING_STATE[0]) {
        // deploy with proxy
        targets[name] = { ...contract };
      } else if (contract.pending === PENDING_STATE[1]) {
        // other contracts
        targets[name] = { ...contract };
      }
    });
  }

  if (Object.keys(targets).length === 0) {
    console.log('Nothing to upgrade');
    process.exit();
  }

  return targets;
};
