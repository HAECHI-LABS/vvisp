module.exports = function(rawABI) {
  const fs = require('fs-extra');
  const path = require('path');

  const ABI = fs.readJsonSync(rawABI);

  let constantFuncs = [];
  let nonConstantFuncs = [];
  let events = [];
  let constructor;
  let lefts = [];

  for (let i = 0; i < ABI.length; i++) {
    if (ABI[i].type === 'event') {
      events.push(ABI[i]);
    } else if (ABI[i].type === 'function') {
      if (ABI[i].constant) {
        overwriteOrPush(constantFuncs, ABI[i]);
      } else {
        overwriteOrPush(nonConstantFuncs, ABI[i]);
      }
    } else if (ABI[i].type === 'constructor') {
      constructor = ABI[i];
    } else {
      lefts.push(ABI[i]); // fallback and something
    }
  }

  return {
    name: path.parse(rawABI).name,
    events: events,
    constantFuncs: constantFuncs,
    nonConstantFuncs: nonConstantFuncs,
    constructor: constructor,
    lefts: lefts
  };

  function overwriteOrPush(array, abi) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === abi.name) {
        array[i] = abi;
        return;
      }
    }
    array.push(abi);
  }
};
