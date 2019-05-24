const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const { execFileSync } = require('child_process');
const { compilerSupplier, printOrSilent } = require('@haechi-labs/vvisp-utils');
const parse = require('./parse.js');

module.exports = async function(contract, options) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider('http://localhost:8545')
  ); // <-----To Do: set real url configured by user

  const vvispState = JSON.parse(fs.readFileSync('./state.vvisp.json', 'utf-8'));
  const address = vvispState.contracts[contract].address;
  const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;

  const solcOutput = await compile(srcPath);

  const baseAst = solcOutput.sources[srcPath].ast;
  const linearIds = getLinearContractIds(baseAst, contract);
  const nodesById = getContractNodesById(solcOutput);
  const linearNodes = linearIds.map(id => nodesById[id]);

  const storageTable = parse(linearNodes);

  for (let i = 0; i < storageTable.length; i++) {
    storageTable[i].push(await web3.eth.getStorageAt(address, i));
    // 하나씩 받다가 타입이 동적배열이면 -> length보고 length 인덱스 위치로 가서 데이터들 가져오기
    // 하나씩 받다가 타입이 맵핑이면 -> 파라미터로 받은 Key에 대해서 데이터들 가져오기
  }

  printOrSilent(`Contract: ${contract}`);
  printOrSilent(`Source: ${path.basename(srcPath)}`);
  printOrSilent(`Address: ${address}`);
  flexTable(storageTable);
  printOrSilent(storageTable.toString());

  /**
   * for test
   */
  // printOrSilent('< view of real storage for test >');
  // const testTable = new Table({ head: ['storage layout'] });
  // for (let i = 0; i < 16; i++) {
  //   testTable.push([
  //     i.toString().padStart(2, ' ') +
  //       '  ' +
  //       (await web3.eth.getStorageAt(address, i))
  //   ]);
  // }
  // flexTable(testTable);
  // printOrSilent(testTable.toString());
};

async function compile(srcPath) {
  // windows specific code
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
