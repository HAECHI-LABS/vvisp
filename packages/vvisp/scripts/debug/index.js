const path = require("path");

const debugModule = require("debug");
const debug = debugModule("lib:commands:debug");

const Config = require("truffle-config");
const Environment = require("./environment");

const { CLIDebugger } = require("./cli-debugger");
const { web3Store } = require('@haechi-labs/vvisp-utils');

module.exports = async function(txHash, options) {
  options = require('../utils/injectConfig')(options);

  const config = options.config;

  config._values['truffle_directory'] = path.resolve(path.join(__dirname, "../"));
  config._values['working_directory'] = process.cwd();

  const resolveDirectory = value => path.resolve(config.working_directory, value);

  const props = {
    // These are already set.
    truffle_directory() {},
    working_directory() {},

    build_directory: {
      default: () => path.join(config.working_directory, "build"),
      transform: resolveDirectory
    },
    contracts_directory: {
      default: () => path.join(config.working_directory, "contracts"),
      transform: resolveDirectory
    },
    contracts_build_directory: {
      default: () => path.join(config.build_directory, "contracts"),
      transform: resolveDirectory
    },
    migrations_directory: {
      default: () => path.join(config.working_directory, "migrations"),
      transform: resolveDirectory
    },
    migrations_file_extension_regexp() {
      return /^\.(js|es6?)$/;
    },
    test_directory: {
      default: () => path.join(config.working_directory, "test"),
      transform: resolveDirectory
    },
    test_file_extension_regexp() {
      return /.*\.(js|ts|es|es6|jsx|sol)$/;
    },
    example_project_directory: {
      default: () => path.join(config.truffle_directory, "example"),
      transform: resolveDirectory
    },
    resolver() {}
  };

  Object.keys(props).forEach(prop => {
    options.config.addProperty(prop, props[prop]);
  });

  // web3Store.setWithProvider(config.provider);
  // config.web3 = web3Store.get();


  //const truffle_config = Config.detect('./vvisp-config.js');


  await Environment.detect(config);


  config.logger = console;

  const interpreter = await new CLIDebugger(config).run(txHash);
  interpreter.start((error) => {
    if (error) {
      console.log(error);
    }
  });


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
