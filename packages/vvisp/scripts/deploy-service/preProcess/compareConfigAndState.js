/**
 * @dev Determine compilation targets and update stateClone from service.vvisp.json and state.vvisp.json
 * @param configContracts Contracts information from service.vvisp.json
 * @param stateClone Clone of deploying state
 * @return Object Information about compilation targets
 */

module.exports = function(configContracts, stateClone) {
  const path = require('path');
  const { forIn } = require('@haechi-labs/vvisp-utils');

  const { PENDING_STATE } = require('../constants');
  const targets = {};

  if (stateClone.notUpgrading) {
    // When deploying DApp first time,
    // 1. If not paused, first copy from service.vvisp.json to stateClone and write PENDING_STATE
    // 2. Move all contracts from stateClone to compile targets.
    forIn(configContracts, (contract, name) => {
      if (!stateClone.paused) {
        stateClone.contracts[name] = { pending: PENDING_STATE[0], ...contract };
      }
      targets[name] = { ...stateClone.contracts[name] };
    });
  } else {
    // When upgrading DApp
    // Branch with paused state
    if (!stateClone.paused) {
      // When not paused, compare with state.vvisp.json and service.vvisp.json
      forIn(configContracts, (contract, name) => {
        if (!stateClone.contracts.hasOwnProperty(name)) {
          // get first-deploying contracts
          stateClone.contracts[name] = {
            pending: PENDING_STATE[0],
            ...contract
          };
          targets[name] = { ...stateClone.contracts[name] };
        } else if (
          path.parse(contract.path).name !==
          stateClone.contracts[name].fileName.slice(0, -4)
        ) {
          // get upgrading contracts
          stateClone.contracts[name] = {
            ...stateClone.contracts[name],
            pending: PENDING_STATE[1],
            ...contract
          };
          targets[name] = { ...stateClone.contracts[name] };
        }
      });
    } else {
      // When paused,
      forIn(stateClone.contracts, (contract, name) => {
        if (
          contract.pending === PENDING_STATE[0] ||
          contract.pending === PENDING_STATE[1]
        ) {
          // deploy with proxy
          targets[name] = { ...contract };
        }
      });
    }
  }

  // Check if there is no upgradeable contract.
  let noProxy = true;
  forIn(targets, contract => {
    if (contract.upgradeable === true) {
      noProxy = false;
    }
  });
  stateClone.noProxy = noProxy;

  return {
    targets: targets,
    noProxy: noProxy
  };
};
