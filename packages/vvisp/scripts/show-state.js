const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const Table = require('cli-table3');
const Web3 = require('web3');
const { execFileSync } = require('child_process');
const {
  compilerSupplier,
  printOrSilent
} = require('@haechi-labs/vvisp-utils');

module.exports = async function(contract, options) {
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // <-----To Do: set real url configured by user

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
  }

  printOrSilent(`Contract: ${contract}`);
  printOrSilent(`Source: ${path.basename(srcPath)}`);
  printOrSilent(`Address: ${address}`);
  flexTable(storageTable);
  printOrSilent(storageTable.toString());

  /**
   * for test
   */
  printOrSilent('< view of real storage for test >');
  const testTable = new Table({ head: ['storage layout']});
  for (let i = 0; i < 16; i++) {
    testTable.push([i.toString().padStart(2, ' ') + '  ' + await web3.eth.getStorageAt(address, i)]);
  }
  flexTable(testTable);
  printOrSilent(testTable.toString());
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

  return JSON.parse(solcOutput);
}

function getLinearContractIds(ast, targetContract) {
  return ast.nodes
    .find(node =>
      node.name == targetContract
    )
    .linearizedBaseContracts.reverse();
}

function getContractNodesById(solcOutput) {
  return Object.values(solcOutput.sources)
    .reduce((acc, src) => {
      src.ast.nodes
        .filter(node =>
          node.nodeType == 'ContractDefinition'
        )
        .forEach(node =>
          acc[node.id] = node
        );
      return acc;
    }, {});
}

function flexTable(table) {
  table.options.head = table.options.head
    .map(str => str.toLowerCase())
    .map(str => chalk.cyanBright.bold(str))
  table.options.colWidths = [];
  table.options.chars['left-mid'] = '';
  table.options.chars['mid'] = '';
  table.options.chars['right-mid'] = '';
  table.options.chars['mid-mid'] = '';
}

function parse(nodes) {
  var indexMap = {};
  // or remove it
  //delete map[key1];
  // or determine whether a key exists
  //key1 in map;
  //indexMap[key1] = value1;
  var count = 0;

  // Entry Point
  nodes
    .forEach(node =>
      node.nodes
        .forEach(function(v) {
          checkType(v);
        })
    );

  function checkType(v, isStruct) {
    if (v.nodeType=="VariableDeclaration") {
        indexingVariable(v, isStruct);
    } else if (v.nodeType=="StructDefinition") {
        indexingStruct(v)
    }
  }

  // function checkType(v, isStruct) {
  //   if (v.typeName.nodeType =="ElementaryTypeName") {
  //     indexingVariable(v, isStruct);
  //   } else if (v.typeName.nodeType == "ArrayTypeName") {
  //     indexingArray(v);
  //   } else if (v.nodeType=="StructDefinition") {
  //     indexingStruct(v)
  //   }
  // }

  function indexingVariable(v, isStruct) {
    if (v.typeName.nodeType == "ArrayTypeName") { // array type
        indexingArray(v);
    } else { // element type
      if (isStruct == null) {
        indexMap[count] = v.name;
      } else {
        indexMap[count] = isStruct+ "." + v.name;
      }
      count++;
    }
  }

  function indexingStruct(v) {
    v.members.forEach(function(v2) {
      checkType(v2, v.name);
    });
  }

  function indexingArray(v) {
    var tmpstring = v.typeDescriptions.typeString;
    tmpstring = tmpstring.split(/[\[\]]/);
    var type = tmpstring[0];

    // Get Array Dimensions
    var dimensions = [];
    for (var i = 1; i < tmpstring.length; i++) {
      if (tmpstring[i] != "") {
        dimensions.push(tmpstring[i]);
      }
    }

    var index = 0;
    string = v.name;
    indexingInnerArray(v, dimensions, string, index);
  }

  function indexingInnerArray(v, dim, string, index) {
    for (var i = 0; i < dim[index]; i++) {
      tmpstring = string + "[" + i + "]"
      if (index < dim.length - 1) {
        indexingInnerArray(v,dim, tmpstring, index + 1)
      } else {
        indexMap[count] = tmpstring
        count++;
      }
    }
  }

  // instantiate
  var table = new Table({
    head: ['VARIABLE', 'INDEX', 'VALUE'],
    colWidths: [25, 25, 25]
  });

  keys = Object.keys(indexMap)
  keys.forEach(function(k) {
    table.push([indexMap[k],k]);
  })

  return table;
}