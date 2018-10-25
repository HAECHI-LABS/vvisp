module.exports = function(string, options) {
  if (options && options.silent) {
    return;
  }
  console.log(string);
};
