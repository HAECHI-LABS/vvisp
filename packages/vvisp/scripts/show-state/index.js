const VariableTracker = require('./variableTracker');
const {
  compile,
  getLinearContractIds,
  getContractNodesById,
  flexTable,
  addVariableValue
} = require('./utils');
const StorageTableBuilder = require('./storageTableBuilder');
const { printOrSilent } = require('@haechi-labs/vvisp-utils');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const stringArgv = require('string-argv');
var web3, address;
var storageTable, storageTableBuilder;

module.exports = async function(contract, options) {
  options = require('../utils/injectConfig')(options);
  var blockchainApiStore = options.config.blockchainApiStore;
  web3 = blockchainApiStore.get();

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

  // build storage table
  storageTableBuilder = new StorageTableBuilder(linearNodes);
  storageTable = storageTableBuilder.build();
  storageTable = await addVariableValue(storageTable, address, web3);

  // print table
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

async function show(args) {
  if (args.length !== 1) {
    console.log(
      'invalid nustorageTablember of args: should be 1, got {0}'.format(
        args.length
      )
    );
    return;
  }

  var variableTracker = new VariableTracker(
    storageTableBuilder.storageTable,
    web3
  );
  var name = args[0];
  var table = variableTracker.getInfo(name);
  table = await addVariableValue(table, address, web3);
  if (table == -1) {
    return;
  }

  printOrSilent(chalk.blue.bold('variableName') + ':' + chalk.bold(name));
  flexTable(table);
  printOrSilent(table.toString());

  console.log(
    chalk.bold(
      '\nIf you want to the storage index of the dynamic variable, enter the command.'
    )
  );
}
