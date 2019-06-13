const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { compilerSupplier, printOrSilent } = require('@haechi-labs/vvisp-utils');
const StorageTableBuilder = require('./storageTableBuilder');
const stringArgv = require('string-argv');
var storageTable;
var storageTableBuilder;
const options = require('../utils/injectConfig')();
const web3 = options.web3
const VariableTracker = require("./variableTracker")

module.exports = async function(contract, options) {
  printOrSilent(
    chalk.bold('Now Start Calculating Storage Index of Variables...\n')
  );

  const vvispState = JSON.parse(fs.readFileSync('./state.vvisp.json', 'utf-8'));
  const address = vvispState.contracts[contract].address;
  const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;

  const solcOutput = await compile(srcPath);

  const baseAst = solcOutput.sources[srcPath].ast;
  const linearIds = getLinearContractIds(baseAst, contract);
  const nodesById = getContractNodesById(solcOutput);
  const linearNodes = linearIds.map(id => nodesById[id]);

  storageTableBuilder = new StorageTableBuilder(linearNodes);

  storageTable = storageTableBuilder.build();
  storageTable = await addVariableValue(storageTable, address, web3);

  printOrSilent(chalk.blue.bold('Contract') + ':' + chalk.bold(contract));
  printOrSilent(
    chalk.blue.bold('Source') + ':' + chalk.bold(path.basename(srcPath))
  );
  printOrSilent(chalk.blue.bold('Address') + ':' + chalk.bold(address));
  flexTable(storageTable);
  printOrSilent(storageTable.toString());

  console.log(
    chalk.bold(
      '\nIf you want to the storage index of the dynamic variable, enter the command.'
    )
  );
  console.log(chalk.bold('Use exit or Ctrl-c to exit'));

  const commander = new Commander(linearNodes);
  commander.add(
    new Command(
      'show',
      '<Variable>',
      'show storage index of input variable',
      show
    )
  );
  await commander.run();
  process.exit(1);

};


async function compile(srcPath) {
  // const solcPath = __dirname + '/solc.exe'; // <------To Do: find another way to compile!!
  // const params = [srcPath, '--combined-json', 'ast,compact-format'];
  // const options = { encoding: 'utf-8' };
  // const solcOutput = execFileSync(solcPath, params, options);

  const DEFAULT_COMPILER_VERSION = '0.5.0'; // <------- integrate with compile.js

  const supplier = new compilerSupplier({
    version: DEFAULT_COMPILER_VERSION
  });
  const solc = await supplier.load();
  const inputDescription = JSON.stringify({
    language: 'Solidity',
    sources: {
      [srcPath]: {
        content: fs.readFileSync(srcPath, 'utf-8')
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '': ['ast']
        }
      }
    }
  });
  const solcOutput = solc.compile(inputDescription);

  fs.writeFileSync('testast.json', solcOutput);

  return JSON.parse(solcOutput);
}

function getLinearContractIds(ast, targetContract) {
  return ast.nodes
    .find(node => node.name == targetContract)
    .linearizedBaseContracts.reverse();
}

function getContractNodesById(solcOutput) {
  return Object.values(solcOutput.sources).reduce((acc, src) => {
    src.ast.nodes
      .filter(node => node.nodeType == 'ContractDefinition')
      .forEach(node => (acc[node.id] = node));
    return acc;
  }, {});
}

function flexTable(table) {
  table.options.head = table.options.head
    .map(str => str.toLowerCase())
    .map(str => chalk.cyanBright.bold(str));
  table.options.colWidths = [];
  table.options.chars['left-mid'] = '';
  table.options.chars['mid'] = '';
  table.options.chars['right-mid'] = '';
  table.options.chars['mid-mid'] = '';
}


async function addVariableValue(storageTable, address, web3) {
  for (let i = 0; i < storageTable.length; i++) {
    var type = storageTable[i][1];
    var size = storageTable[i][2];
    var index = storageTable[i][3];
    var startByte = storageTable[i][4];
    var hexValue = await web3.eth.getStorageAt(address, index);

    hexValue = hexValue.replace("0x", "")
    hexValue = hexValue.padStart(64, "0");

    var hexLen = hexValue.length
    var value = hexValue.slice(hexLen-2*startByte-2*size, hexLen-2*startByte)
    // hex formatting
    if(value.indexOf('0x') == -1){
      value = '0x' + value;
    }

    // type converting
    if(type.indexOf('function') == -1 && type.indexOf('mapping') == -1){
      if (type.indexOf('uint') != -1) {
        value = parseInt(value, 16)

      }else if(type.indexOf('int') != -1){
        size = parseInt(type.split('t')[1]) / 8;
        if (isNaN(size)) {
          size = 32;
        }
        value = hexToSignedInt(value, size)

      }else if(type =='bool' ){
        value = parseInt(value, 16)
        if(value ==0){
          value = 'false'
        }else if(value ==1){
          value = 'true'
        }
      }else if(type == 'string'){
        value = value.slice(0, value.length-1)
        var j;
        for(j=value.length-1; j>=0; j--){
          if(value[j] !=0){
            break;
          }
        }
        value = value.slice(0,j+1)
        value = hex2a(value)
      }  
    }

    storageTable[i].push(value);
  }
  return storageTable
}



function Command(name, options, description, func) {
  return {
    name: name,
    options: options,
    description: description,
    run: func
  };
}

function Commander(linearNodes) {
  return {
    end: true,
    linearNodes: linearNodes,
    commands: {},
    add: function(command) {
      this.commands[command.name] = command;
    },
    run: async function() {
      while (this.end) {
        const prompt = '>> ';
        process.stdout.write(prompt);
        const line = await readLine();
        const args = stringArgv(line);

        if (args.length === 0) {
          continue;
        }

        // check default command
        switch (args[0]) {
          case 'help':
            let msg = 'Usage: <command> [<args...>]\n\n';
            msg = msg + 'where <command> is one of: darray, mapping, help\n\n';
            msg = msg + 'Commands:\n\n';
            for (const key of Object.keys(this.commands)) {
              const command = this.commands[key];
              msg =
                msg +
                '\t{0} {1}{2}\n\n'.format(
                  chalk.bold(command.name.padEnd(8)),
                  chalk.bold(command.options.padEnd(60)),
                  command.description
                );
            }
            console.log(msg);
            continue;
          case 'exit':
            this.end = false;
            continue;
        }

        if (this.commands[args[0]] === undefined) {
          console.log('invalid command: {0}'.format(args[0]));
          continue;
        }

        // run command
        try {
          await this.commands[args[0]].run(
            args.slice(1, args.length),
            this.linearNodes
          );
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
}

/**
 * Read one line from stdin and return it
 * @returns {Promise} Promise object to returns the value read from stdin
 */
function readLine() {
  return new Promise(function(resolve) {
    process.stdin.once('data', function(data) {
      resolve(data.toString().trim());
    });
  });
}

async function show(args, address, web3) {
  if (args.length !== 1) {
    console.log(
      'invalid nustorageTablember of args: should be 1, got {0}'.format(args.length)
    );
    return;
  }

  var variableTracker = new VariableTracker(storageTableBuilder.storageTable);
  var name = args[0];
  var table = variableTracker.getInfo(name);

  /*
  if (array) {
    var result = await storageTableBuilder.buildDynamicArray(
      args[0],
      address,
      web3,
      linearNodes
    );
    var table = result[0];
    var baseIndex = result[1];

    for (let i = 0; i < table.length; i++) {
      value = await web3.eth.getStorageAt(address, baseIndex);
      table[i].push(value);
      baseIndex = '0x' + (BigInt(baseIndex) + BigInt(1)).toString(16);
    }
  } else if (mapping) {
    var result = storageTableBuilder.buildMapping(args[0], web3);
    var table = result[0];
    var baseIndex = result[1];

    for (let i = 0; i < table.length; i++) {
      value = await web3.eth.getStorageAt(address, baseIndex);
      table[i].push(value);
    }
  }
*/

  table = await addVariableValue(table, address, web3);


  printOrSilent(chalk.blue.bold('variableName') + ':' + chalk.bold(name));
  //printOrSilent(chalk.blue.bold('baseIndex') + ':' + chalk.bold(baseIndex));
  flexTable(table);
  printOrSilent(table.toString());

  console.log(
    chalk.bold(
      '\nIf you want to the storage index of the dynamic variable, enter the command.'
    )
  );
}


function hex2a(hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

function hexToSignedInt(hex, size) {

  var val = {
      mask: 0x80 * Math.pow(8, size-1), 
      sub: -0x100 * Math.pow(8, size-1) 
  }
  if((parseInt(hex, 16) & val.mask) > 0) { //negative
    return (val.sub + parseInt(hex, 16))
  }else {                                 //positive
    return (parseInt(hex,16))

  }
}