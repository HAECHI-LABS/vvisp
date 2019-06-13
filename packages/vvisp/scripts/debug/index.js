const Config = require("truffle-config");
const Environment = require("./environment");
const { CLIDebugger } = require("./cli-debugger");

module.exports = async function(txHash, options) {
  const truffle_config = Config.detect('./vvisp-config.js');

  await Environment.detect(truffle_config);

  truffle_config.logger = console;

  const interpreter = await new CLIDebugger(truffle_config).run(txHash);

  interpreter.start((error) => {
    if (error) {
      console.log(error);
    }
  });
}
