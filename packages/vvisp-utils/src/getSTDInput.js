/**
 * Read one line from stdin and return it
 * @param {String} question question to user by stdout
 * @returns {Promise} Promise object to returns the value read from stdin
 */
module.exports = async function(question) {
  if (question) {
    process.stdout.write(question);
  }

  return new Promise(function(resolve) {
    // process.stdin.once('data', function(data) {
    //   resolve(data.toString().trim());
    // });
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', chunk => {
      // Use a loop to make sure we read all available data.
      resolve(chunk);
    });

    process.stdin.on('end', () => {
      console.log('There will be no more data.');
      process.stdout.write('end');
    });
  });
};
