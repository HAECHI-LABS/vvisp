module.exports = async function(filePath, silent) {
  DEFAULT_COMPILER_VERSION = '0.4.23';

  const fs = require('fs');
  const path = require('path');
  const solc = await getSolc();
  const ff = require('node-find-folder');
  const chalk = require('chalk');
  const printOrSilent = require('./printOrSilent');

  printOrSilent(chalk.bold('Compiling...'), { silent });

  let input = {};

  if (Array.isArray(filePath)) {
    for (let i = 0; i < filePath.length; i++) {
      printOrSilent(`compile ${filePath[i]}...`, { silent });
      input = Object.assign(input, {
        [filePath[i]]: { content: fs.readFileSync(filePath[i], 'utf8') }
      });
    }
  } else if (typeof filePath === 'string') {
    printOrSilent(`build ${filePath}...`, { silent });
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
    if (!silent) {
      console.log('\n');
      for (let i = 0; i < compileOutput.errors.length; i++) {
        console.log(compileOutput.errors[i]);
      }
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
    const fileName = `${path.parse(filePath).name}.sol`;
    return {
      contents: fs.readFileSync(
        path.join('./', `${new ff(fileName)[0]}`),
        'utf8'
      )
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

  async function getSolc() {
    const compilerSupplier = require('./utils/compilerSupplier');
    const supplier = new compilerSupplier({
      version: process.env.SOLC_VERSION
        ? process.env.SOLC_VERSION
        : DEFAULT_COMPILER_VERSION
    });
    const sol = await supplier.load();
    return sol;
  }
};
