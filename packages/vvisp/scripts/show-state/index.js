const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const { execFileSync } = require('child_process');
const { compilerSupplier, printOrSilent } = require('@haechi-labs/vvisp-utils');
const StorageTableBuilder = require('./storageTableBuilder');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // <-----To Do: set real url configured by user
const stringArgv = require('string-argv');
var storageTable;
var address;
var tableStack = [];
var storageTableBuilder;

module.exports = async function(contract, options) {
  printOrSilent(
    chalk.bold('Now Start Calculating Storage Index of Variables...\n')
  );

  const vvispState = JSON.parse(fs.readFileSync('./state.vvisp.json', 'utf-8'));
  address = vvispState.contracts[contract].address;
  const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;

  const solcOutput = await compile(srcPath);

  const baseAst = solcOutput.sources[srcPath].ast;
  const linearIds = getLinearContractIds(baseAst, contract);
  const nodesById = getContractNodesById(solcOutput);
  const linearNodes = linearIds.map(id => nodesById[id]);

  storageTableBuilder = new StorageTableBuilder(linearNodes);

  storageTable = storageTableBuilder.build(linearNodes);

  for (let i = 0; i < storageTable.length; i++) {
    index = storageTable[i][3];
    value = await web3.eth.getStorageAt(address, index);
    storageTable[i].push(value);
  }

  printOrSilent(chalk.blue.bold('Contract') + ':' + chalk.bold(contract));
  printOrSilent(
    chalk.blue.bold('Source') + ':' + chalk.bold(path.basename(srcPath))
  );
  printOrSilent(chalk.blue.bold('Address') + ':' + chalk.bold(address));
  flexTable(storageTable);
  printOrSilent(storageTable.toString());

  /*
  global.chalk = {
    success: chalk.green.bold,
    address: chalk.cyan,
    tx: chalk.cyan,
    head: chalk.bold,
    error: chalk.red.bold,
    keyWord: chalk.blue.bold,
    notImportant: chalk.gray,
    warning: chalk.yellow
  };
*/

  console.log(
    chalk.bold(
      '\nIf you want to the storage index of the dynamic variable, enter the command.'
    )
  );
  console.log(chalk.bold('Use exit or Ctrl-c to exit'));

  const commander = new Commander(linearNodes);
  commander.add(
    new Command(
      'darray',
      '<Variable>',
      'show storage index of input dynamic array variable',
      darray
    )
  );
  commander.add(
    new Command(
      'mapping',
      '<Variable>',
      'show storage index of input mapping variable',
      mapping
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

async function darray(args, linearNodes) {
  if (args.length !== 1) {
    console.log(
      'invalid number of args: should be 1, got {0}'.format(args.length)
    );
    return;
  }

  var result = await storageTableBuilder.buildDynamicArray(
    args[0],
    address,
    web3,
    linearNodes
  );
  var table = result[0];
  var baseIndex = result[1];

  printOrSilent(chalk.blue.bold('variableName') + ':' + chalk.bold(args[0]));
  printOrSilent(chalk.blue.bold('baseIndex') + ':' + chalk.bold(baseIndex));
  flexTable(table);
  printOrSilent(table.toString());

  console.log(
    chalk.bold(
      '\nIf you want to the storage index of the dynamic variable, enter the command.'
    )
  );
  console.log(chalk.bold('Use prev command to see the previous table'));
}

async function mapping(args, linearNodes) {
  if (args.length !== 1) {
    console.log(
      'invalid number of args: should be 1, got {0}'.format(args.length)
    );
    return;
  }

  var result = storageTableBuilder.buildMapping(args[0], web3);
  var table = result[0];
  var baseIndex = result[1];

  for (let i = 0; i < table.length; i++) {
    value = await web3.eth.getStorageAt(address, baseIndex);
    table[i].push(value);
  }

  printOrSilent(chalk.blue.bold('variableName') + ':' + chalk.bold(args[0]));
  printOrSilent(chalk.blue.bold('baseIndex') + ':' + chalk.bold(baseIndex));
  flexTable(table);
  printOrSilent(table.toString());

  console.log(
    chalk.bold(
      '\nIf you want to the storage index of the dynamic variable, enter the command.'
    )
  );
}

// 누가 동적변수인지 구분가능한 기능 필요함

/*
  prevTable = tableStack[tableStack.length - 1][3];

  if (tableStack.length == 1) {
    base = 0;
  } else {
    base = tableStack[tableStack.length - 1][2];
  }
  tableStack.push([target, type, baseIndex, dynamicStorageTable]);

*/

/*
async function prev(args, linearNodes) {
  if (args.length !== 0) {
    console.log(
      'invalid number of args: should be 0, got {0}'.format(args.length)
    );
    return;
  }

  tableStack.pop();
  prevTableInfo = tableStack[tableStack.length-1]
  prevTable = prevTableInfo[3]


  if(tableStack.length==0){
    console.log(chalk.bold('\nIf you want to the storage index of the dynamic variable, enter the command.'));
    console.log(chalk.bold('Use exit or Ctrl-c to exit'));

    printOrSilent(chalk.blue.bold('Contract')+':' + chalk.bold(prevTableInfo[0]));
    printOrSilent(chalk.blue.bold('Source')+':' + chalk.bold(prevTableInfo[1]));
    printOrSilent(chalk.blue.bold('Address')+':' + chalk.bold(prevTableInfo[2]));

  }else{
    console.log(chalk.bold('\nIf you want to the storage index of the dynamic variable, enter the command.'));
    console.log(chalk.bold('Use prev command to see the previous table'));

    printOrSilent(chalk.blue.bold('variableName')+':' + chalk.bold(prevTableInfo[0]));
    printOrSilent(chalk.blue.bold('type')+':' + chalk.bold(prevTableInfo[1]));
    printOrSilent(chalk.blue.bold('baseIndex')+':' + chalk.bold(prevTableInfo[2]));

  }
  flexTable(prevTable);
  printOrSilent(prevTable.toString());

}
*/
