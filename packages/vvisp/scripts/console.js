const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const stringArgv = require('string-argv');
const _ = require('lodash');
const { parseLogs } = require('@haechi-labs/vvisp-utils');
const { STATE_FILE } = require('../config/Constant');

if (!String.prototype.format) {
  String.prototype.format = function() {
    const args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

const defaultStateFile = STATE_FILE;

/**
 *
 * console function:
 * 1. check script path and get available contract list
 * 2. check the state json file
 *    2.1 if the state json is not exist, let the user enter the address for each contract.
 *    2.2 if the state json is exist, get the address from the json file.
 * 3. start interactive console
 *
 *
 * interactive console has following command
 * command:
 *    - register: register the address of smart contracts
 *    - show <name>: show all the available api in the contract
 *    - call <name> <method> [params...]: call the method
 *    - list: show all contracts name and address
 *    - help: print help message
 */

module.exports = async function(scriptPath, options) {
  options = require('./utils/injectConfig')(options);

  let rawApis = setApi(scriptPath, options);
  if (rawApis === undefined || rawApis === '') {
    return;
  }

  let apis;
  if (fs.existsSync(defaultStateFile)) {
    apis = setApiAddress(rawApis, defaultStateFile);
  } else {
    apis = await getAddressFromSTDIN(rawApis);
  }

  printApiInfo(apis);

  const apiCommander = new ApiCommander(apis);
  apiCommander.add(
    new Command(
      'register',
      '',
      'register the address of smart contracts',
      register
    )
  );
  apiCommander.add(
    new Command('list', '', 'list the available smart contracts', list)
  );
  apiCommander.add(
    new Command(
      'show',
      '<Name>',
      'show the available method of a smart contract',
      show
    )
  );
  apiCommander.add(
    new Command(
      'call',
      '<Name> <Method> [Params...]',
      'call a smart contract api method',
      call
    )
  );

  await apiCommander.run(options);
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

/**
 *
 * @param {object} apis has an api of smart contracts
 */
function ApiCommander(apis) {
  return {
    end: true,
    apis: apis,
    commands: {},
    add: function(command) {
      this.commands[command.name] = command;
    },
    run: async function(options) {
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
            msg = msg + 'where <command> is one of: call, show, list, help\n\n';
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
            this.apis,
            options
          );
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
}

/**
 *
 * @param {object} apis has an api of smart contracts
 */
function printApiInfo(apis) {
  let msg = 'Available contract contracts:\n';
  console.log(msg);
  console.log(getApiInfo(apis));
  console.log('\nIf you are wondering how to use it, type help command.');
  console.log(chalk.bold('Use exit or Ctrl-c to exit'));
}

/**
 * Print all the api methods of the smart contract
 * @param {object} args is a list of command args
 * @param {object} apis has an api of smart contracts
 */
async function show(args, apis) {
  if (args.length !== 1) {
    console.log(
      'invalid number of args: should be 1, got {0}'.format(args.length)
    );
    return;
  }

  const contractKey = args[0];
  if (apis[contractKey] === undefined) {
    console.log("'{0}' contract does not exist".format(args[0]));
    return;
  }

  const contract = new apis[contractKey]['api'](
    apis[contractKey]['address'].toLowerCase()
  );
  let msg = '\n' + '[Method]'.padEnd(40) + '[Args]\n';

  apis[contractKey].api['abi']
    .filter(function(obj) {
      return obj.type === 'function';
    })
    .sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }

      return 0;
    })
    .forEach(function(functionAbi) {
      msg =
        msg +
        '{0}[{1}]\n'.format(
          functionAbi.name.padEnd(40),
          getArgs(contract['methods'][functionAbi.name], functionAbi).join(', ')
        );
    });
  console.log(msg);
}

function getArgs(func, functionAbi) {
  return functionAbi.inputs.map((input, i) => {
    return input.type + ' ' + (input.name || `input${i + 1}`);
  });
}

async function register() {
  console.log(
    'To dynamically register a contract to the console, write the contract name, address, and filename.'
  );

  process.stdout.write('Enter the name of contract: ');
  const contractName = await readLine();

  const questions = ['address', 'fileName', 'name'];
  const contract = {};
  for (const key in questions) {
    process.stdout.write('Enter the {0} of contract: '.format(questions[key]));
    contract[questions[key]] = await readLine();
  }

  const f = fs.readFileSync(defaultStateFile, { encoding: 'utf8' });
  const state = JSON.parse(f);
  const contracts = state['contracts'];
  contracts[contractName] = contract;
  fs.writeFileSync(defaultStateFile, JSON.stringify(state, null, 2));

  console.log(
    'The address and filename information of the contract has been successfully saved to state.vvisp.json.'
  );
}

/**
 *
 * Call api of a smart contract and print a result.
 * @param {object} args is a list of command args
 * @param {object} apis has an api of smart contracts
 * @param {object} options is a global option
 */
async function call(args, apis, options) {
  if (args.length < 2) {
    console.log(
      'invalid number of args: should be at least 2(contract name, method name), got {0}'.format(
        args.length
      )
    );
    return;
  }

  const contractKey = args[0];
  const methodName = args[1];

  if (apis[contractKey] === undefined) {
    console.log('no {0} contract is exist'.format(args[0]));
    return;
  }

  const params = args.slice(2, args.length).map(param => {
    // convert array string to array
    // "[0x123, 0x234]" to ["0x123", "0x234"]
    if (param.startsWith('[') && param.endsWith(']')) {
      return param
        .slice(1, param.length - 1)
        .split(/\s*,\s*/)
        .map(v => {
          // remove empty space for each element
          return v.trim();
        });
    }
    return param;
  });

  params.push({
    gasLimit: options.config.gasLimit,
    gasPrice: options.config.gasPrice,
    platform: options.config.platform
  });

  const receiptFilter = [
    'transactionHash',
    'transactionIndex',
    'blockNumber',
    'from',
    'to',
    'gasUsed',
    'logs',
    'name',
    'args'
  ];
  const contract = new apis[contractKey]['api'](
    apis[contractKey]['address'].toLowerCase()
  );
  try {
    if (!contract.methods[methodName]) {
      throw new Error(`There is no function name of ${methodName}`);
    }
    const receipt = await contract.methods[methodName].apply(undefined, params);
    if (typeof receipt !== 'object') {
      // result of constant functions
      console.log(JSON.stringify(receipt, undefined, 2));
    } else if (Array.isArray(receipt.logs)) {
      // receipt is Receipt of transaction
      const events = parseLogs(receipt.logs, apis[contractKey].api['abi']);
      const logs = [];
      for (const key in events) {
        logs.push({
          transactionHash: events[key].transactionHash,
          name: events[key].name,
          args: events[key].args
        });
      }

      receipt.logs = undefined;
      const result = JSON.parse(JSON.stringify(receipt, receiptFilter));
      result.logs = logs;
      console.log(JSON.stringify(result, undefined, 2));
    } else {
      // multiple constant return values
      const result = JSON.parse(JSON.stringify(receipt, null));
      console.log(JSON.stringify(result, undefined, 2));
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 *
 * Print all available smart contracts
 * @param {object} args is a list of command args
 * @param {object} apis has an api of smart contracts
 */
async function list(args, apis) {
  if (args.length !== 0) {
    console.log(
      'invalid number of args: should be 0, got {0}'.format(args.length)
    );
    return;
  }
  console.log(getApiInfo(apis));
}

/**
 *
 * Get the information of apis
 * @param {object} apis has an api of smart contracts
 * @RETURN {string} info shows the currently used smart contracts and address.
 */
function getApiInfo(apis) {
  const pad1 = 10;
  const pad2 = 20;
  let info =
    'Index'.padEnd(pad1) +
    'Name'.padEnd(pad2) +
    'Contract'.padEnd(pad2) +
    'Address\n';
  let i = 0;

  for (const [key, contract] of Object.entries(apis)) {
    const address = contract.address;
    if (address) {
      info =
        info +
        `[${i}]`.padEnd(pad1) +
        key.padEnd(pad2) +
        contract.name.padEnd(pad2) +
        address +
        '\n';
      i++;
    }
  }

  return info;
}

/**
 *
 * Get the script api and abi of a smart contract from contractApis
 * @param {string} scriptPath is a path to contractApi which is generated
 *  from vvisp gen-script command
 * @param {object} options is the configuration information
 * @return {object} object has an api of smart contracts
 */
function setApi(scriptPath, options = {}) {
  const defaultScriptPath = process.cwd() + '/contractApis';
  if (scriptPath === undefined || scriptPath === '') {
    scriptPath = defaultScriptPath;
  }

  if (!fs.existsSync(scriptPath)) {
    console.log(
      "Run 'vvisp gen-script' command first to create api of smart contracts."
    );
    return;
  }

  // set script api
  // omit configuration functions
  const apis = _.omit(
    require(path.join(scriptPath, 'back') + '/index.js')({
      ...options.config._values
    }),
    ['config']
  );

  // set abi
  for (const key of Object.keys(apis)) {
    apis[key]['abi'] = require(path.join(scriptPath, 'back', 'abi') +
      '/' +
      key +
      '.json');
  }

  return apis;
}

/**
 *
 * Set the address of the contract from state.json file
 * @param {object} rawApis is a object that has an api of smart contracts
 * @param {string} stateFilePath is a path of vvisp.state.json file
 * @RETURN {object} apis is a object having an api of smart contracts
 */
function setApiAddress(rawApis, stateFilePath) {
  const f = fs.readFileSync(stateFilePath, { encoding: 'utf8' });
  const state = JSON.parse(f);
  const contracts = state['contracts'];

  if (Object.keys(contracts).length === 0) {
    throw new Error('There are no contracts in the state file.');
  }

  for (const key of Object.keys(contracts)) {
    let name = contracts[key]['name'];
    if (!name) {
      const filePath = contracts[key]['fileName'];
      if (!filePath) {
        throw new Error('fileName does not exist in state.vvisp.json');
      }
      name = path.parse(filePath).name;
    }

    if (rawApis[name]) {
      contracts[key]['api'] = rawApis[name];
      contracts[key]['name'] = name;
    } else {
      // mismatch occurred between vvisp.state and apis
      throw new Error(
        'Mismatch has occurred between state.vvisp.json and apis. Please check state.vvisp.json file and contractApis/'
      );
    }
  }

  return contracts;
}

/**
 * Get the address of the contract from stdin and set address to apis
 * @param {object} rawApis is a object having an api of smart contracts
 * @returns {object} apis is a object having an api and address of smart contracts
 */
async function getAddressFromSTDIN(rawApis) {
  console.log(
    "'{0}' does not existing in current path({1})\n".format(
      defaultStateFile,
      process.cwd()
    )
  );

  console.log(
    "Run 'vvisp deploy-service' command to create state.vvisp.json and rerun 'vvisp console' again, \nor enter the address of the currently registered contract\n"
  );
  console.log('Available contract contracts:');

  for (const key of Object.keys(rawApis)) {
    console.log('%s', key);
  }

  const contracts = {};
  for (const key of Object.keys(rawApis)) {
    process.stdout.write('\nEnter the address of {0}: '.format(key));
    const address = await readLine();
    contracts[key] = {
      api: rawApis[key],
      address: address
    };
  }

  return contracts;
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
