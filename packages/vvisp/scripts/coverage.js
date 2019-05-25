module.exports = async function() {
    const { printOrSilent } = require('@haechi-labs/vvisp-utils');

    const exec = require('child_process').exec;
    const testscript = exec('sh scripts/coverage.sh')
    
    testscript.stdout.on('data', function(data){
       console.log(data);
    });
    testscript.stderr.on('data', function(data){
        console.log(data);
    });
    
}
  