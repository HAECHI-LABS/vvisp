module.exports = function(contractJson) {
  const constantFuncs = contractJson.constantFuncs;

  for (let i = 0; i < constantFuncs.length; i++) {
    const inputs = constantFuncs[i].inputs;
    if (inputs.length > 0 && inputs[0].name === '') {
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].name = `input${j + 1}`;
      }
    }
  }

  return contractJson;
};
