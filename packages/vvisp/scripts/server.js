const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const stringArgv = require('string-argv');
const _ = require('lodash');
const { getSTDInput, parseLogs } = require('@haechi-labs/vvisp-utils');
const { STATE_FILE } = require('../config/Constant');

/*
 * express related imports
 * */

var express = require('express');

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
    throw new Error('state.vvisp.json not set');
  }

  console.log(getApiInfo(apis));
  var app = express();

  app.get('/:contract/:func', async function(req, res) {
    const abi = apis[req.params.contract].api.abi.filter(
      a => a.name == req.params.func
    );
    if (abi.length == 0) {
      console.log('WRONG function ' + req.params.func);
      res.status(404).send({ message: 'Function no found' });
    } else if (!abi[0].constant) {
      console.log(abi);
      console.log('WARNING non constant function was called through GET');
      res.status(403).send({ message: "Can't write to blockchain using GET" });
    } else {
      const result = await call(
        req.params.contract,
        req.params.func,
        req.query.args,
        apis
      );
      res.send(
        JSON.stringify({
          result: result
        })
      );
    }
  });

  app.post('/:contract/:func', async function(req, res) {
    const abi = apis[req.params.contract].api.abi.filter(
      a => a.name == req.params.func
    );
    if (abi.length == 0) {
      console.log('WRONG function ' + req.params.func);
      res.status(404).send({ message: 'Function no found' });
    } else if (abi[0].constant) {
      console.log(abi);
      console.log('WARNING constant function was called through POST');
      res.status(403).send({ message: "Can't READ blockchain using POST" });
    } else {
      const result = await call(
        req.params.contract,
        req.params.func,
        req.query.args,
        apis
      );
      console.log(result);
      res.send(JSON.stringify({ result: result }));
    }
  });

  app.get('/:contract', function(req, res) {
    console.log(req.params);
    const abi = apis[req.params.contract].api.abi;
    const constant_abi = abi.filter(a => a.constant == true);
    console.log(constant_abi);
    res.send(JSON.stringify(constant_abi, '', 2));
  });

  app.get('/', function(req, res) {
    console.log(req);
    res.send('HHH');
  });

  app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
  });
};

function getArgs(func, functionAbi) {
  return functionAbi.inputs.map((input, i) => {
    return input.type + ' ' + (input.name || `input${i + 1}`);
  });
}

async function register() {
  console.log(
    'To dynamically register a contract to the console, write the contract name, address, and filename.'
  );

  const contractName = await getSTDInput('Enter the name of contract: ');

  const questions = ['address', 'fileName', 'name'];
  const contract = {};
  for (const key in questions) {
    contract[questions[key]] = await getSTDInput(
      'Enter the {0} of the contract: '.format(questions[key])
    );
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
async function call(contractKey, methodName, args, apis, options) {
  //const contractKey = args[0];
  //const methodName = args[1];

  if (apis[contractKey] === undefined) {
    console.log('no {0} contract is exist'.format(args[0]));
    return;
  }

  if (args == undefined) {
    args = [];
  }
  const params = args.slice(0, args.length).map(param => {
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

  if (options != undefined) {
    params.push({
      gasLimit: options.config.gasLimit,
      gasPrice: options.config.gasPrice,
      platform: options.config.platform
    });
  }

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
      return receipt;
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
    const address = await getSTDInput(
      '\nEnter the address of {0}: '.format(key)
    );
    contracts[key] = {
      api: rawApis[key],
      address: address
    };
  }

  return contracts;
}
