module.exports = function(deployState) {
  const { CONSTRUCTOR, INITIALIZE, VARIABLES } = require('../constants');
  const { forIn } = require('@haechi-labs/vvisp-utils');
  const { getVar, hasConstructArgs, hasInitArgs } = require('../utils/index');

  const stateClone = deployState.getState();
  const variables = deployState[VARIABLES];

  forIn(stateClone.contracts, (contract, name) => {
    if (hasInitArgs(contract)) {
      _injectVar(variables, stateClone, name, INITIALIZE);
    }
    if (hasConstructArgs(contract)) {
      _injectVar(variables, stateClone, name, CONSTRUCTOR);
    }
  });

  deployState.updateState(stateClone);

  function _injectVar(_variables, _stateClone, _name, _type) {
    const _contract = _stateClone.contracts[_name];
    const _arguments =
      _type === CONSTRUCTOR
        ? _contract[CONSTRUCTOR]
        : _contract[INITIALIZE].arguments;
    const _path = `${_name}/${_type}`;

    _injecting(_variables, _stateClone, _path, _arguments, _contract);
  }

  function _injecting(_variables, _stateClone, _path, _arguments, _contract) {
    const [name, type] = _path.split('/');
    for (let i = 0; i < _arguments.length; i++) {
      const newPath = `${_path}/${i}`;
      if (Array.isArray(_arguments[i])) {
        _injecting(_variables, _stateClone, newPath, _arguments[i], _contract);
        continue;
      }
      const variable = getVar(_arguments[i]);
      if (!variable) {
        continue;
      }
      const splits = variable.split('.');
      if (splits[0] === 'contracts' && splits[2] === 'address') {
        const dependency = _stateClone.contracts[splits[1]];
        if (!dependency) {
          throw new Error(`There is no ${splits[1]} in service.contracts`);
        }
        if (!dependency.upgradeable && dependency.pending === 'deploy') {
          if (!dependency['childNode']) {
            dependency['childNode'] = [];
          }
          dependency['childNode'].push(newPath);
          if (type === CONSTRUCTOR) {
            if (!_contract['parentNode']) {
              _contract['parentNode'] = [];
            }
            _contract['parentNode'].push(splits[1]);
          }
        } else {
          _arguments[i] = dependency.proxy || dependency.address;
        }
      } else if (splits[0] === VARIABLES) {
        if (!_variables || !_variables[splits[1]]) {
          throw new Error(`There is no ${splits[1]} in service.${VARIABLES}`);
        }
        // Inject Variable
        _arguments[i] = _variables[splits[1]];
      } else {
        throw new Error(`Wrong Expression at ${name}, ${_arguments[i]}`);
      }
    }
  }
};
