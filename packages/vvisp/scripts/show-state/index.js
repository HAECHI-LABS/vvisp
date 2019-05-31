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

// == show ==
// 변수가 존재하면
// 전부자기자신 그대로 출력

// 동적배열만 자식따라가서 출력? (추가기능)

// 변수가 존재안하면
// [ 기준으로 잘라냄
// 앞부분이 없으면 진짜없는거
// 앞부분이 있으면 타입확인
// []가 있으면 동적배열 (우선)
// 우선순위 파싱로직
// mapping이 있으면 맵핑
// 우선순위 파싱로직
// 없으면 잘못된 참조

// 배열 순서는 선언과 거꾸로 된다고 보면됨 (바깥쪽부터 차오르는거는 맞음)
// 즉 arr[2][4] -> arr[0][0], arr[0][1], arr[1][0], arr[1][1] 순으로 차오름
// == 우선순위 파싱 로직 ==
// dim과 Type Flag를 구한다
// 변수 x[3][key1][key2][3][5][2]
// dimensions : [3, key1, key2, 3]. 참조하게될 위치
// type : ( mapping => (mapping => int[2][3][]) )[]
// typeFlag : ([], mapping, mapping, [], [3], [2]) : 순서대로임
// 순서대로 참조값이 일치하는지 확인
//   - dimensions가 더 긴경우 에러
//   - []인데 key가 들어가면안됨
// 통과하면 이제 실제로 돌려보면서 값을 구한다.
//  중간값 처리 x[3]이 child / x가 parent
//    - x가 동적배열 : x[3]의 인덱스 = 해시(x의 인덱스) + 3
//    - x가 맵핑 : x[3]의 인덱스 = 해시(키 3+x의 인덱스)
//    - 일반변수 : 끝
//    - x가 배열 : x[3]의 인덱스 = x+3
//    - x가 다중배열 : x[3][3]의 인덱스 = x+9
//    - x가 구조체 : x.k[]의 인덱스 = x의 구조체테이블안의 k의 인덱스
//  최종값 처리
//    - 동적배열 : 현재배열의 자식들 보여줌(선택사항)
//    - 맵핑 : 그냥 끝
//    - 일반변수 : 그냥 끝
//    - 배열 : 그냥 값하나만 보여주자
//    - 구조체 : 안에있는값들 다보여주자

async function show(args, linearNodes) {
  if (args.length !== 1) {
    console.log(
      'invalid number of args: should be 1, got {0}'.format(args.length)
    );
    return;
  }
  var table = new Table({
    head: ['VARIABLE', 'TYPE', 'SIZE', 'INDEX', 'STARTBYTE', 'VALUE'],
    colWidths: [25, 25, 25]
  });

  // 변수가 존재하면
  var name = args[0];
  if (name in storageTable.get()) {
    var row = storageTable.get()[name];
    var type = row[0];
    // 동적배열이면
    if (type.indexOf('[]') != -1) {
      // 따라가서 자식 출력 (추가기능)
    } else {
      // 전부자기자신 그대로 출력
      table.push(row);
    }

    // 변수가 존재안하면
  } else {
    // [ 기준으로 잘라냄
    name = input.split('[')[0];
    // 앞부분이 없으면 진짜없는거
    if (!name in storageTable.get()) {
      console.log('The variable does not exist.');
      return -1;
    } else {
      // 앞부분이 있으면 타입확인
      var row = storageTable.get()[name];
      var type = row[0];
      // []가 있으면 동적배열 (우선) mapping이 있으면 맵핑
      if (type.indexOf('[]') != -1 || type.indexOf('mapping') != -1) {
        // 우선순위대로 따라가보자
        // == 우선순위 파싱 로직 ==
        // dim과 Type Flag를 구한다
        // dimensions : [3, key1, key2, 3]. 참조하게될 위치
        var getDimensions = new ASTParser().getDimensions;
        var dimensions = getDimensions(input);

        var typeFlag;
        /* 계산 규칙 */
        // type : ( mapping => (mapping => int[2][3][]) )[]
        // typeFlag : ([], mapping, mapping, [], [3], [2]) : 순서대로임

        // 순서대로 참조값이 일치하는지 확인
        //   - dimensions가 더 긴경우 에러
        if (dimensions.length > typeFlag.length) {
          console.log('Invalid reference.');
          return -1;
        }

        //   - 대응되는 놈들이 일반값들이어야함
        for (var i = 0; i < dimensions.length; i++) {
          if (typeFlag[i].indexOf('[]') == -1) {
            if (typeFlag.indexOf('mapping') == -1) {
              console.log('Invalid reference.');
              return -1;
            }
          } else {
            //   - []인데 key가 들어가면안됨
            if (dimensions[i] /* String 이면!! (NaN이면!!)*/) {
              console.log('Invalid reference.');
              return -1;
            }
          }
        }

        // 통과하면 이제 실제로 돌려보면서 값을 구한다.
        child.name = '';
        parent.name = name;
        parent.type = type;
        parent.size = row[1];
        child.name = child.name + diemnsions[i];
        child.type = typeFlag[i];
        for (i = 0; i < dimensions.length; i++) {
          //  중간값 처리 x[3]이 child / x가 parent

          switch (parent.type) {
            case darray:
              //    - x가 동적배열 : x[3]의 인덱스 = 해시(x의 인덱스) + 3
              var baseIndex = web3.utils.soliditySha3(String(index));
              baseIndex =
                '0x' + (BigInt(baseIndex) + BigInt(dimensions[i])).toString(16);
              break;

            case mapping:
              //    - x가 맵핑 : x[3]의 인덱스 = 해시(키 3+x의 인덱스)
              var key = dimensions[i];
              index = web3.utils.soliditySha3(String(key), String(index));
              break;

            case normal:
              //    - 일반변수 : 끝
              finalData = normal;
              break;

            case array:
              //    - x가 배열 : x[3]의 인덱스 = x+3
              //    - x가 다중배열 : x[3][3]의 인덱스 = x+9

              dimensionsnum = 0;

              for (var j = 0; j < dimensions.length; j++) {
                if (typeFlag == []) {
                  break;
                }
                dimensionsnum++;
              }
              break;

            case struct:
              //    - x가 구조체 : x.k[]의 인덱스 = x의 구조체테이블안의 k의 인덱스
              finalData = struct;
              break;
          }

          parent.name = child.name;
          parent.type = child.type;
          parent.size = row[1];
          child.name = child.name + diemnsions[i];
          child.type = typeFlag[i];
        }

        //  최종값 처리

        switch (child.type) {
          case darray:
          //    - 동적배열 : 현재배열의 자식들 보여줌(선택사항)

          case mapping:
          case normal:
            //    - 맵핑, 일반변수 : 그냥 끝
            break;

          case array:
            //    - 배열 : 그냥 값하나만 보여주자

            break;

          case struct:
            //    - 구조체 : 안에있는값들 다보여주자
            break;
        }
      } else {
        // 없으면 잘못된 참조
        console.log('Invalid reference.');
        return -1;
      }
    }
  }

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
