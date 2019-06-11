const debugModule = require("debug");
const debug = debugModule("lib:commands:debug");

const Config = require("truffle-config");
const Environment = require("./environment");

const { CLIDebugger } = require("./cli-debugger");


module.exports = async function(txHash, options) {
  //options = require('../utils/injectConfig')(options);

  const config = Config.detect('./vvisp-config.js');
  await Environment.detect(config);
  config.logger = console;
  const interpreter = await new CLIDebugger(config).run(txHash);
  interpreter.start((error) => { console.log(error); });


  // Promise.resolve()
  //   .then(async () => {
  //     const config = Config.detect('./vvisp-config.js');
  //     await Environment.detect(config);
  //     config.logger = console;
  //     //const txHash = config._[0]; //may be undefined
  //     return await new CLIDebugger(config).run(txHash);
  //   })
  //   .then(interpreter => interpreter.start((error) => { console.log(error); }))
  //   .catch((error) => { console.log(error); });
}
