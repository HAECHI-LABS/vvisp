const fs = require('fs');
const path = require('path');
const compile = require('truffle-compile');
const {
  compilerSupplier,
  findImportPath
} = require('@haechi-labs/vvisp-utils');

class DebugCompiler {
  constructor(config) {
    this.config = config;
  }

  async compile() {
    //we need to set up a config object for the compiler.
    //it's the same as the existing config, but we turn on quiet.
    //unfortunately, we don't have Babel here, so cloning is annoying.
    const compileConfig = Object.assign(
      {},
      ...Object.entries(this.config).map(([key, value]) => ({ [key]: value }))
    ); //clone
    compileConfig.quiet = true;

    // since `compile.all()` returns two results, we can't use promisify
    // and are instead stuck with using an explicit Promise constructor
    const { contracts, files } = await new Promise((accept, reject) => {
      compile.all(compileConfig, (err, contracts, files) => {
        if (err) {
          return reject(err);
        }

        return accept({ contracts, files });
      });
    });

    const options = require('../../utils/injectConfig')({ silent: true });
    const compilerOption = extractCompilerOption(options);
    const solc = await getSolc(compilerOption);

    const input = {};
    const relativeFiles = files.map(file => path.relative(process.cwd(), file));
    relativeFiles.forEach(file => {
      if (fs.existsSync(file)) {
        input[file] = { content: fs.readFileSync(file, 'utf-8') };
      }
    });
    const inputDescription = JSON.stringify({
      language: 'Solidity',
      sources: input,
      settings: {
        evmVersion: compilerOption.settings.evmVersion,
        optimizer: compilerOption.settings.optimizer,
        outputSelection: {
          '*': {
            '*': ['evm.bytecode.object', 'evm.deployedBytecode.object']
          }
        }
      }
    });
    const vvispCompileOutput = JSON.parse(
      solc.compile(inputDescription, findImports)
    );

    Object.values(contracts).forEach(contract => {
      const name = contract.contract_name;
      const srcPath = path.relative(process.cwd(), contract.sourcePath);

      if (vvispCompileOutput.contracts.hasOwnProperty(srcPath)) {
        const evm = vvispCompileOutput.contracts[`${srcPath}`][`${name}`].evm;
        const correctBytecode = '0x' + evm.bytecode.object;
        const correctDeployedBytecode = '0x' + evm.deployedBytecode.object;

        contract.bytecode = correctBytecode;
        contract.deployedBytecode = correctDeployedBytecode;
      }
    });

    return { contracts, files };

    async function getSolc(compilerOption) {
      const supplier = new compilerSupplier({
        version: compilerOption.version
      });
      return supplier.load();
    }

    function extractCompilerOption(options) {
      const DEFAULT_COMPILER_VERSION = '0.5.0';

      let compilers;
      try {
        compilers = options.config.compilers.solc || {};
      } catch (e) {
        compilers = {};
      }

      if (!compilers.version) {
        compilers.version = DEFAULT_COMPILER_VERSION;
      }

      if (!compilers.settings) {
        compilers.settings = {};
      }

      return compilers;
    }

    function findImports(filePath) {
      return {
        contents: fs.readFileSync(findImportPath(filePath), 'utf8')
      };
    }
  }
}

module.exports = {
  DebugCompiler
};
