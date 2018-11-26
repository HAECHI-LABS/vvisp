module.exports = async function(filePath, silent) {
  const fs = require('fs');
  const path = require('path');
  const solc = await getSolc();
  const ff = require('node-find-folder');
  const chalk = require('chalk');

  if (!silent) {
    //TODO make console.log wrapper with silent => use lib/printOrSilent.js
    console.log(chalk.bold('Compiling...'));
  }

  //TODO: functionize making input obj
  let input = {};

  if (Array.isArray(filePath)) {
    for (let i = 0; i < filePath.length; i++) {
      //TODO: for loop -> Array.prototype.map
      if (!silent) {
        console.log('compile ' + filePath[i] + '...'); //TODO: string contat -> ` ${ } `
      }
      input = Object.assign(input, {
        // TODO: survey what if we don't use Object.assign
        [filePath[i]]: fs.readFileSync(filePath[i], 'utf8')
      });
    }
  } else if (typeof filePath === 'string') {
    if (!silent) {
      console.log('build ' + filePath + '...');
    }
    input = Object.assign(input, {
      [filePath]: fs.readFileSync(filePath, 'utf8')
    });
  } else {
    throw new TypeError('Invalid Type'); //TODO more informative error: e.g. "Your argumet is:"" but this is not valid inpout"
  }
  const compileOutput = solc.compile(
    { sources: input },
    process.env.SOLC_OPTIMIZATION === 'false' ? 0 : 1,
    findImports
  );

  if (compileOutput.errors) {
    if (!silent) {
      console.log('\n');
      for (let i = 0; i < compileOutput.errors.length; i++) {
        //TODO for -> map
        console.log(compileOutput.errors[i]);
      }
    }

    if (
      compileOutput.errors.length > 0 &&
      Object.keys(compileOutput.contracts).length === 0 //TODO: why check this out? doesn't if(compileOutput.errors) in line 39 enought check?
    ) {
      throw new Error('Compilation Error!');
    }
  }

  return compileOutput;

  function findImports(filePath) {
    const fileName = `${path.parse(filePath).name}.sol`;
    return {
      contents: fs.readFileSync(
        path.join('./', `${new ff(fileName)[0]}`),
        'utf8'
      )
    };
  }

  async function getSolc() {
    const solc = require('solc');
    if (!process.env.SOLC_VERSION) {
      return solc;
    } else {
      return new Promise((resolve, reject) => {
        //TODO try to find it out removing promise
        solc.loadRemoteVersion(process.env.SOLC_VERSION, function(
          err,
          solcSnapshot
        ) {
          if (err) {
            reject(err);
          } else {
            resolve(solcSnapshot);
          }
        });
      });
    }
  }
};
