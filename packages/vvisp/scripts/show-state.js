const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const Table = require('cli-table3');
const Web3 = require('web3');
const { execFileSync } = require('child_process');
const { compilerSupplier, printOrSilent } = require('@haechi-labs/vvisp-utils');

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
  const testTable = new Table({ head: ['storage layout'] });
  for (let i = 0; i < 16; i++) {
    testTable.push([
      i.toString().padStart(2, ' ') +
        '  ' +
        (await web3.eth.getStorageAt(address, i))
    ]);
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

function parse(nodes) {
  var indexMap = {};
  var structMap = {};
  var indexCounter = { currentIndex: 0 };
  var structCounter = { currentIndex: 0 };

  var bytesInSlot = 0;

  // structMap
  // structMap[struct_id][{name, ref_id} of struct_element]
  // ref_id는 element가 struct일때 존재

  function getTypeSize(type) {
    var elementTypeSize = {
      bool: 1,
      address: 20,
      'address payable': 20,
      byte: 1,
      contract: 20, // ????
      enum: 1, //?????
      'function (bool) external': 24, //?????
      'function (bool) internal': 8,
      'function () external view returns (int8)': 24,
      'function () internal view returns (int8)': 8
      //string
      //bytes
    };

    if (type.indexOf('int') != -1) {
      size = parseInt(type.split('t')[1]) / 8;
      if (isNaN(size)) {
        size = 32;
      }
    } else if (type.indexOf('bytes') != -1) {
      size = parseInt(type.split('s')[1]);
      if (isNaN(size)) {
        size = 'dynamic';
      }
    } else if (type.indexOf('fixed') != -1) {
      size = parseInt(type.split('d')[1].split('x')[0]) / 8;
      if (isNaN(size)) {
        size = 16;
      }
    } else {
      size = elementTypeSize[type];
    }
    return size;
  }

  var queue = [];
  // Entry Point
  nodes.forEach(node =>
    node.nodes.forEach(function(variable) {
      checkStructDef(variable);
    })
  );

  while (queue.length != 0) {
    checkStructDef(queue.pop());
  }

  nodes.forEach(node =>
    node.nodes.forEach(function(variable) {
      checkType(variable, 'normal', null);
    })
  );

  function checkStructDef(variable) {
    if (variable.nodeType == 'StructDefinition') {
      hasStruct = true;

      // 스트럭트의 멤버들 중 스트럭트가 있나 확인
      for (i = 0; i < variable.members.length; i++) {
        var2 = variable.members[i];
        if (var2.typeDescriptions.typeString.indexOf('struct') != -1) {
          // 있으면 멤버 스트럭트가 스트럭트맵에 존재하는지 확인

          if (var2.typeName.nodeType == 'ArrayTypeName') {
            refid = var2.typeName.baseType.referencedDeclaration;
          } else if (var2.typeName.nodeType == 'UserDefinedTypeName') {
            refid = var2.typeName.referencedDeclaration;
          }

          if (structMap[refid] == null) {
            // 존재하지 않으면 큐에 넣고 이따가 진행
            queue.push(variable);
            hasStruct = false;
            return 0;
          }
        }
      }

      if (hasStruct) {
        // 존재하면 진행
        // 해당 struct의 객체 생성
        structMap[variable.id] = {};

        structCounter.currentIndex = 0;
        bytesInSlot = 0;

        variable.members.forEach(function(var2) {
          checkType(var2, 'structDef', variable.id);
        });
        // (index, name의 해쉬들을 집어넣어야됨)
        // struct인경우에는 레퍼런스id 집어넣자
      }
    }
  }

  // 변수 타입 별로 인덱싱
  function checkType(variable, type, def_id) {
    if (variable.nodeType == 'VariableDeclaration') {
      if (variable.typeName.nodeType == 'ElementaryTypeName') {
        indexingElement(variable, type, def_id);
      } else if (variable.typeName.nodeType == 'ArrayTypeName') {
        indexingArray(variable, type, def_id);
      } else if (variable.typeName.nodeType == 'UserDefinedTypeName') {
        indexingStruct(variable, type, def_id);
      }
    }
  }

  // structMap, Counter와 indexMap, Counter 중 택1
  function selectMapCount(type, def_id) {
    var targetMap;

    if (type == 'normal') {
      targetMap = indexMap;
      counter = indexCounter;
    } else if (type == 'structDef') {
      targetMap = structMap[def_id];
      counter = structCounter;
    }
    return [targetMap, counter];
  }

  // [일반변수]

  function indexingElement(variable, type, def_id) {
    // 스트럭트 정의인지, 변수선언인지에 따라 인덱스 저장할 맵 선택
    returnVal = selectMapCount(type, def_id);
    targetMap = returnVal[0];
    counter = returnVal[1];

    // element의 인덱스 지정
    setCounterIndex(counter, variable.typeDescriptions.typeString);
    addVarToMap(variable.name, targetMap, counter);
  }

  function addVarToMap(var_name, targetMap, counter, type) {
    if (counter.currentIndex in targetMap) {
      tmpList = targetMap[counter.currentIndex];
      if (!Array.isArray(tmpList)) {
        tmpList = [tmpList];
      }

      tmpList.push(var_name);

      targetMap[counter.currentIndex] = tmpList;
    } else {
      targetMap[counter.currentIndex] = var_name;
    }
  }

  function setCounterIndex(counter, type) {
    bytesInSlot += getTypeSize(type);
    if (bytesInSlot > 32) {
      bytesInSlot = getTypeSize(type);
      counter.currentIndex++;
    }
  }

  // [배열]

  function indexingArray(variable, type, def_id) {
    // create len array
    var tmpstring = variable.typeDescriptions.typeString;
    tmpstring = tmpstring.split(/[\[\]]/);

    // Get Array Dimensions
    var dimensions = [];
    for (var i = 1; i < tmpstring.length; i++) {
      if (tmpstring[i] != '') {
        dimensions.push(tmpstring[i]);
      }
    }

    var index = 0;
    string = variable.name;
    indexingInnerArray(variable, dimensions, string, index, type, def_id);
  }

  function indexingInnerArray(variable, dim, string, index, type, def_id) {
    // 스트럭트 정의인지, 변수선언인지에 따라 인덱스 저장할 맵 선택
    returnVal = selectMapCount(type, def_id);
    targetMap = returnVal[0];
    counter = returnVal[1];

    for (var i = 0; i < dim[index]; i++) {
      tmpstring = string + '[' + i + ']';
      if (index < dim.length - 1) {
        indexingInnerArray(variable, dim, tmpstring, index + 1);
      } else {
        // 배열타입이 element, array 타입인경우

        // 배열타입이 구조체인 경우
        if (variable.typeName.baseType.nodeType == 'UserDefinedTypeName') {
          // struct 정의인 경우
          if (type == 'normal') {
            indexingStruct(variable, 'normal_array', def_id, tmpstring);
          } else if (type == 'structDef') {
            indexingStruct(variable, 'structDef_array', def_id, tmpstring);
          }

          // 배열 선언인 경우
        } else {
          //targetMap[counter.currentIndex] = tmpstring;
          setCounterIndex(
            counter,
            variable.typeName.baseType.typeDescriptions.typeString
          );
          addVarToMap(tmpstring, targetMap, counter);
        }
      }
    }
  }

  // [구조체]

  function indexingStruct(variable, type, def_id, arrayName) {
    // def_id는 정의 스트럭트의 id

    // 변수선언 인경우 -> 스트럭트맵에서 받아와서 인덱싱맵에 저장
    // 스트럭트 id에 해당하는 객체획득
    // 인덱스 적힌대로 안에거 하나씩 집어넣음
    // 근데 스트럭트 id적힌애를 만나면?
    // 다시 스트럭트맵에서 받아와야함

    var prevStructIndex = -1;

    // 변수 선언 : 스트럭트 변수 선언
    if (type == 'normal') {
      var struct_id = variable.typeName.referencedDeclaration;
      var name = variable.name;
      returnVal = selectMapCount('normal', def_id);
      targetMap = returnVal[0];
      counter = returnVal[1];

      bytesInSlot = 0;
    } // 타입이 구조체인 배열 변수선언인 경우
    else if (type == 'normal_array') {
      var struct_id = variable.typeName.baseType.referencedDeclaration;
      var name = arrayName;

      returnVal = selectMapCount('normal', def_id);
      targetMap = returnVal[0];
      counter = returnVal[1];

      bytesInSlot = 0;
    }
    // 스트럭트 정의 : 스트럭트안의 스트럭트 s -> 스트럭트맵에서 스트럭트 s의 id로 내용 가져옴
    else if (type == 'structDef') {
      var struct_id = variable.typeName.referencedDeclaration;
      var name = variable.name;
      returnVal = selectMapCount('structDef', def_id);
      targetMap = returnVal[0];
      counter = returnVal[1];

      // 스트럭트 정의 : 스트럭트안의 스트럭트타입의 배열
    } else if (type == 'structDef_array') {
      var struct_id = variable.typeName.baseType.referencedDeclaration;
      var name = arrayName;

      returnVal = selectMapCount('structDef', def_id);
      targetMap = returnVal[0];
      counter = returnVal[1];
    }

    for (var key in structMap[struct_id]) {
      indexDiff = key - prevStructIndex;
      counter.currentIndex += indexDiff;

      tmpList = [];

      if (Array.isArray(structMap[struct_id][key])) {
        structMap[struct_id][key].forEach(function(val) {
          tmpList.push(name + '.' + val);
          prevStructIndex = key;
        });
        targetMap[counter.currentIndex] = tmpList;
        console.log(
          counter.currentIndex + ':' + targetMap[counter.currentIndex]
        );
      } else {
        targetMap[counter.currentIndex] =
          name + '.' + structMap[struct_id][key];
        console.log(
          counter.currentIndex + ':' + targetMap[counter.currentIndex]
        );
      }

      prevStructIndex = key;
    }
  }

  // instantiate
  var table = new Table({
    head: ['VARIABLE', 'INDEX', 'VALUE'],
    colWidths: [25, 25, 25]
  });

  keys = Object.keys(indexMap);
  keys.forEach(function(k) {
    console.log(indexMap[k]);
    table.push([indexMap[k].toString(), k]);
  });

  return table;
}
