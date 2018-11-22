const abi = require('ethereumjs-abi');

function encodeCall(name, _arguments, values) {
  const methodId = abi.methodID(name, _arguments).toString('hex');
  const params = abi.rawEncode(_arguments, values).toString('hex');
  return '0x' + methodId + params;
}

module.exports = encodeCall;
