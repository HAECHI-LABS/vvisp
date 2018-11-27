module.exports = function(argument) {
  if (typeof argument !== 'string') {
    return false;
  }
  if (argument.slice(0, 2) === '${' && argument.slice(-1) === '}') {
    return argument.slice(2, -1);
  }
};
