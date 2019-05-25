module.exports = async function(files, options) {
    options = require('./utils/injectConfig')(options);
    const path = require('path');
    const { printOrSilent } = require('@haechi-labs/vvisp-utils');
    const { exec } = require('child_process');
    
    let rootDir = path.join('./');
    if (options && options.directory) {
      rootDir = path.join(options.directory);
    }

    path.join(rootDir,'scripts/coverage.sh');
    exec(rootDir,(error,stdout,stderr) => {
    if(error) {
        console.error('exec error: ${error}');
        return;
    }
    console.log('stdout: ${stdout}');
    console.log('stderr: ${stderr}');
    });
    printOrSilent('Compiling Finished!', options);
  };
  