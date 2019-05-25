module.exports = async function(filePath, options) {
  const DEFAULT_COMPILER_VERSION = '0.5.8';

  const compilerOption = extractCompilerOption(options);

  const fs = require('fs');
  const solc = await getSolc(compilerOption);
  const chalk = require('chalk');
  const printOrSilent = require('./printOrSilent');
  const findImportPath = require('./findImportPath');

  printOrSilent(chalk.bold('Compiling...'), options);

  let input = {};

  if (Array.isArray(filePath)) {
    for (let i = 0; i < filePath.length; i++) {
      printOrSilent(`compile ${filePath[i]}...`, options);
      input = Object.assign(input, {
        [filePath[i]]: { content: fs.readFileSync(filePath[i], 'utf8') }
      });
    }
  } else if (typeof filePath === 'string') {
    printOrSilent(`build ${filePath}...`, options);
    input = Object.assign(input, {
      [filePath]: { content: fs.readFileSync(filePath, 'utf8') }
    });
  } else {
    throw new TypeError(`Invalid File Path, ${filePath}`);
  }
  const compileOutput = JSON.parse(
    solc.compile(
      JSON.stringify({
        language: 'Solidity',
        sources: input,
        settings: {
          evmVersion: compilerOption.settings.evmVersion,
          optimizer: compilerOption.settings.optimizer,
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      }),
      findImports
    )
  );
  if (compileOutput.errors) {
    printOrSilent('\n', options);
    for (let i = 0; i < compileOutput.errors.length; i++) {
      printOrSilent(compileOutput.errors[i], options);
    }

    if (
      compileOutput.errors.length > 0 &&
      Object.keys(compileOutput.contracts).length === 0
    ) {
      throw new Error('Compilation Error!');
    }
  }
  return fiveToFour(compileOutput);

  function findImports(filePath) {
    return {
      contents: fs.readFileSync(findImportPath(filePath), 'utf8')
    };
  }

  function fiveToFour(compileOutputV5) {
    const compileOutputV4 = {};
    const filePaths = Object.keys(compileOutputV5['contracts']);
    for (let filePath of filePaths) {
      let contracts = Object.keys(compileOutputV5['contracts'][filePath]);
      for (let contractName of contracts) {
        let key = `${filePath}:${contractName}`;
        compileOutputV4[key] = {
          bytecode: '',
          interface: { abi: '' }
        };
        compileOutputV4[key]['interface'] = JSON.stringify(
          compileOutputV5['contracts'][filePath][contractName]['abi']
        );
        compileOutputV4[key]['bytecode'] =
          compileOutputV5['contracts'][filePath][
            contractName
          ].evm.bytecode.object;
      }
    }
    const result = {};
    result['contracts'] = Object.assign({}, compileOutputV4);
    return result;
  }

  async function getSolc(compilerOption) {
    const CompilerSupplier = require('./compilerSupplier');
    const supplier = new CompilerSupplier({
      version: compilerOption.version
    });
    return supplier.load();
  }

  function extractCompilerOption(options) {
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
};
