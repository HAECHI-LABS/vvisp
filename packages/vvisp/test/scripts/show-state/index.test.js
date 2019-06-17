const {
  SymbolTable,
  ASTParser
} = require('../../../scripts/show-state/astParser');
const StorageTableBuilder = require('../../../scripts/show-state/storageTableBuilder');
const VariableTracker = require('../../../scripts/show-state/variableTracker');
const chai = require('chai');
chai.use(require('chai-as-promised')).should();
const expect = chai.expect;
const fs = require('fs');
const utils = require('../../../scripts/show-state/utils');

const { execSync } = require('child_process');
const path = require('path');
const options = require('../../../scripts/utils/injectConfig')();
const web3 = options.web3;

describe('# show-state script test', function() {
  describe('# astParser script test', function() {
    it('getTypeSize: should return correct type size', async function() {
      // given
      var types = [
        'bool',
        'address',
        'address payable',
        'byte',
        'bytes',
        'string',
        'function (bool) external',
        'function (bool)',
        'function () view external returns (int8)',
        'function () view returns (int8)',
        'mapping(uint256 => uint256)',
        'uint256[]',
        'int64',
        'bytes31',
        'fixed128x18',
        'enum test',
        'contract t'
      ];
      var astParser = new ASTParser();
      var sizeAnswer = [
        1,
        20,
        20,
        1,
        32,
        32,
        24,
        8,
        24,
        8,
        32,
        32,
        8,
        31,
        16,
        1,
        20
      ];

      // when
      var sizes = [];
      types.forEach(function(type, i) {
        sizes.push(astParser.getTypeSize(type));
      });

      // then
      expect(sizes).to.deep.equal(sizeAnswer);
    });

    it('getTypeSize: if type is invalid, throw exception', async function() {
      // given
      var astParser = new ASTParser();

      // when, then
      expect(() => astParser.getTypeSize('invalid')).to.throw(
        'invalidTypeException'
      );
    });

    it('checkType: element Type', async function() {
      // given
      var elementOutput = JSON.parse(
        fs.readFileSync(
          'test/dummy/show-state/ast/element_output.json',
          'utf-8'
        )
      );
      var symbolTable = new SymbolTable();
      var astParser = new ASTParser(symbolTable);
      var elementAST =
        elementOutput.sources['./contracts/elementTestcase.sol'].ast;

      // when
      numElementVar = 0;
      elementAST.nodes[1].nodes.forEach(function(v) {
        type = astParser.checkType(v);
        if (type == 'element') {
          numElementVar++;
        }
      });

      // then
      expect(numElementVar).equal(21);
    });

    it('checkType: array Type', async function() {
      // given
      var arrayOutput = JSON.parse(
        fs.readFileSync('test/dummy/show-state/ast/array_output.json', 'utf-8')
      );
      var symbolTable = new SymbolTable();
      var astParser = new ASTParser(symbolTable);
      var arrayAST = arrayOutput.sources['./contracts/arrayTestcase.sol'].ast;

      // when
      numArrayVar = 0;
      arrayAST.nodes[1].nodes.forEach(function(v) {
        type = astParser.checkType(v);
        if (type == 'array') {
          numArrayVar++;
        }
      });

      // then
      expect(numArrayVar).equal(11);
    });

    it('checkType: struct Type', async function() {
      // given
      var arrayOutput = JSON.parse(
        fs.readFileSync('test/dummy/show-state/ast/struct_output.json', 'utf-8')
      );
      var arrayAST = arrayOutput.sources['./contracts/structTestcase.sol'].ast;
      var symbolTable = new SymbolTable();
      var astParser = new ASTParser(symbolTable);

      // when
      numStructVar = 0;
      arrayAST.nodes[1].nodes.forEach(function(v) {
        type = astParser.checkType(v);
        if (type == 'struct') {
          numStructVar++;
        }
      });

      // then
      expect(numStructVar).equal(3);
    });

    it('parseElement: should return correct parsed result', async function() {
      // given
      var elementOutput = JSON.parse(
        fs.readFileSync(
          'test/dummy/show-state/ast/element_output.json',
          'utf-8'
        )
      );
      var symbolTable = new SymbolTable();
      var astParser = new ASTParser(symbolTable);
      var elementAST =
        elementOutput.sources['./contracts/elementTestcase.sol'].ast;

      // when
      elementAST.nodes[1].nodes.forEach(function(v) {
        astParser.parse(v);
      });

      symbolTable = astParser.symbolTable;
      var getTypeSize = astParser.getTypeSize;
      // then
      expect_symbolTable_equal('var_bool', 'bool', 0, symbolTable, getTypeSize);
      expect_symbolTable_equal('var_int8', 'int8', 1, symbolTable, getTypeSize);
      expect_symbolTable_equal(
        'var_int256',
        'int256',
        2,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_int',
        'int256',
        3,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_uint8',
        'uint8',
        4,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_uint256',
        'uint256',
        5,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_uint',
        'uint256',
        6,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_address',
        'address',
        7,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_address_payable',
        'address payable',
        8,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_byte',
        'bytes1',
        9,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_bytes2',
        'bytes2',
        10,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_bytes32',
        'bytes32',
        11,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_contract',
        'contract elementTestcase',
        12,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_enum',
        'enum elementTestcase.myEnum',
        13,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_f1',
        'function (bool) external',
        14,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_f2',
        'function (bool)',
        15,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_f3',
        'function () view external returns (int8)',
        16,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_f4',
        'function () view returns (int8)',
        17,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_bytes',
        'bytes',
        18,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_string',
        'string',
        19,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_mapping',
        'mapping(uint256 => uint256)',
        20,
        symbolTable,
        getTypeSize
      );
    });

    it('getDimensions: should return correct dimensions', async function() {
      // given
      var astParser = new ASTParser();
      astParser.parseInnerArray = function() {};

      // when
      dim1 = astParser.getDimensions('uint[5]');
      dim2 = astParser.getDimensions('mapping(uint256 => uint256)[2][7]');
      dim3 = astParser.getDimensions('bytes[1][2][3]');
      dim4 = astParser.getDimensions('address[][]');

      // then
      expect(dim1).to.deep.equal(['5']);
      expect(dim2).to.deep.equal(['7', '2']);
      expect(dim3).to.deep.equal(['3', '2', '1']);
      expect(dim4).to.deep.equal(['', '']);
    });

    it('parseArray: should return correct parsed result', async function() {
      // given
      var arrayOutput = JSON.parse(
        fs.readFileSync('test/dummy/show-state/ast/array_output.json', 'utf-8')
      );
      var symbolTable = new SymbolTable();
      var astParser = new ASTParser(symbolTable);
      var arrayAST = arrayOutput.sources['./contracts/arrayTestcase.sol'].ast;

      // when
      arrayAST.nodes[1].nodes.forEach(function(v) {
        astParser.parse(v);
      });
      symbolTable = astParser.symbolTable;
      var getTypeSize = astParser.getTypeSize;

      // then
      expect_symbolTable_equal(
        'array_bool[4]',
        'bool',
        4,
        symbolTable,
        getTypeSize
      );
      expect_variable_not_in_symbolTable('array_bool[5]', astParser);
      expect_symbolTable_equal(
        'array_int8[3][3]',
        'int8',
        20,
        symbolTable,
        getTypeSize
      );
      expect_variable_not_in_symbolTable('array_bool[4][3]', astParser);
      expect_variable_not_in_symbolTable('array_bool[3][4]', astParser);
      expect_symbolTable_equal(
        'array_uint[2][1][3]',
        'uint256',
        44,
        symbolTable,
        getTypeSize
      );
      expect_variable_not_in_symbolTable('array_bool[4][1][3]', astParser);
      expect_variable_not_in_symbolTable('array_bool[1][1][3]', astParser);
      expect_symbolTable_equal(
        'array_address[2]',
        'address',
        47,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'array_bytes2[3]',
        'bytes2',
        51,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'array_contract[2]',
        'contract arrayTestcase',
        54,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'array_enum[2]',
        'enum arrayTestcase.myEnum',
        57,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'array_function[2]',
        'function () view external returns (int8)',
        60,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'array_bytes[2]',
        'bytes',
        63,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'array_string[2]',
        'string',
        66,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'array_mapping[2]',
        'mapping(uint256 => uint256)',
        69,
        symbolTable,
        getTypeSize
      );
    });

    it('parseStruct: should return correct parsed result', async function() {
      // given
      var structOutput = JSON.parse(
        fs.readFileSync('test/dummy/show-state/ast/struct_output.json', 'utf-8')
      );
      var structAST =
        structOutput.sources['./contracts/structTestcase.sol'].ast;
      var testobject = [structAST.nodes[1]];
      var tableBuilder = new StorageTableBuilder(testobject);
      var astParser = new ASTParser();

      // when
      tableBuilder.buildStructSymbolTables();
      for (var structTypeName in tableBuilder.structTables) {
        // then
        expect_structSymbolTable(
          structTypeName,
          tableBuilder.structTables[structTypeName],
          astParser.getTypeSize
        );
      }
    });

    it('parse: arrayOfStruct testcase', async function() {
      // given
      var arrayStructOutput = JSON.parse(
        fs.readFileSync(
          'test/dummy/show-state/ast/arrayOfStruct_output.json',
          'utf-8'
        )
      );
      var arrayStructAST =
        arrayStructOutput.sources['./contracts/arrayOfStructTestcase.sol'].ast;
      var testobject = [arrayStructAST.nodes[1]];
      var tableBuilder = new StorageTableBuilder(testobject);
      var astParser = new ASTParser();

      // when
      tableBuilder.buildStructSymbolTables();
      for (var structTypeName in tableBuilder.structTables) {
        // then
        expect_arrayStructSymbolTable(
          structTypeName,
          tableBuilder.structTables[structTypeName],
          astParser.getTypeSize
        );
      }
    });
  });

  describe('# storageTableBuilder script test', function() {
    before(function() {});

    after(function() {});

    it('buildStorageTable: return valid storageTable', async function() {
      // given
      var structOutput = JSON.parse(
        fs.readFileSync('test/dummy/show-state/ast/struct_output.json', 'utf-8')
      );
      var structAST =
        structOutput.sources['./contracts/structTestcase.sol'].ast;
      var testobject = [structAST.nodes[1]];
      var tableBuilder = new StorageTableBuilder(testobject);
      var getTypeSize = new ASTParser().getTypeSize;

      // when
      tableBuilder.buildStructSymbolTables();
      var storageTable = tableBuilder.buildStorageTable();

      // then
      expect_symbolTable_equal(
        's1.var_bool',
        'bool',
        0,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's1.var_int8',
        'int8',
        1,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's1.var_address',
        'address',
        2,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's1.var_contract',
        'contract structTestcase',
        3,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's1.var_enum',
        'enum structTestcase.myEnum',
        4,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's1.var_f1',
        'function (bool) external',
        5,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's1.var_mapping',
        'mapping(uint256 => uint256)',
        6,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's2.var_bytes2[2]',
        'bytes2',
        9,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's2.var_bytes32[2][2]',
        'bytes32',
        18,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's3.is2.var_bytes',
        'bytes',
        19,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's3.is2.var_string',
        'string',
        20,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        's3.is2.is1.var_byte[0][0]',
        'bytes1',
        21,
        storageTable,
        getTypeSize
      );
    });

    it('calculateIndex: calculate valid storage index', async function() {
      // given
      var structOutput = JSON.parse(
        fs.readFileSync('test/dummy/show-state/ast/struct_output.json', 'utf-8')
      );
      var structAST =
        structOutput.sources['./contracts/structTestcase.sol'].ast;
      var testobject = [structAST.nodes[1]];
      var tableBuilder = new StorageTableBuilder(testobject);
      var getTypeSize = new ASTParser().getTypeSize;

      // when
      tableBuilder.buildStructSymbolTables();
      var storageTable = tableBuilder.buildStorageTable();
      tableBuilder.calculateIndex(storageTable);

      // then
      expect_symbolTable_equal_with_index(
        's1.var_bool',
        'bool',
        0,
        0,
        0,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's1.var_int8',
        'int8',
        1,
        0,
        1,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's1.var_address',
        'address',
        2,
        0,
        2,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's1.var_contract',
        'contract structTestcase',
        3,
        1,
        0,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's1.var_enum',
        'enum structTestcase.myEnum',
        4,
        1,
        20,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's1.var_f1',
        'function (bool) external',
        5,
        2,
        0,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's1.var_mapping',
        'mapping(uint256 => uint256)',
        6,
        3,
        0,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's2.var_bytes2[2]',
        'bytes2',
        9,
        4,
        4,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's2.var_bytes32[2][2]',
        'bytes32',
        18,
        13,
        0,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's3.is2.var_bytes',
        'bytes',
        19,
        14,
        0,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's3.is2.var_string',
        'string',
        20,
        15,
        0,
        storageTable,
        getTypeSize
      );
      expect_symbolTable_equal_with_index(
        's3.is2.is1.var_byte[0][0]',
        'bytes1',
        21,
        16,
        0,
        storageTable,
        getTypeSize
      );
    });

    it('show command: input normal vairables', async function() {
      // given
      var Output = JSON.parse(
        fs.readFileSync(
          'test/dummy/show-state/ast/element_output.json',
          'utf-8'
        )
      );
      var ast = Output.sources['./contracts/elementTestcase.sol'].ast;
      var testobject = [ast.nodes[1]];
      var storageTableBuilder = new StorageTableBuilder(testobject);
      storageTableBuilder.build();
      var variableTracker = new VariableTracker(
        storageTableBuilder.storageTable
      );

      // when
      testNames = [
        'var_bool',
        'var_int8',
        'var_int256',
        'var_uint',
        'var_address',
        'var_bytes2',
        'var_enum',
        'var_f1',
        'var_string',
        'var_mapping'
      ];
      answerRow = [
        ['var_bool', 'bool', 1, 0, 0],
        ['var_int8', 'int8', 1, 0, 1],
        ['var_int256', 'int256', 32, 1, 0],
        ['var_uint', 'uint256', 32, 5, 0],
        ['var_address', 'address', 20, 6, 0],
        ['var_bytes2', 'bytes2', 2, 7, 21],
        ['var_enum', 'enum elementTestcase.myEnum', 1, 9, 20],
        ['var_f1', 'function (bool) external', 24, 10, 0],
        ['var_string', 'string', 32, 13, 0],
        ['var_mapping', 'mapping(uint256 => uint256)', 32, 14, 0]
      ];
      // then
      for (var i = 0; i < testNames.length; i++) {
        result = variableTracker.getInfo(testNames[i]);
        expect(result[0]).to.deep.equal(answerRow[i]);
      }
    });

    it('show command: check non existing vairables', async function() {
      // given
      var Output = JSON.parse(
        fs.readFileSync('test/dummy/show-state/ast/array_output.json', 'utf-8')
      );
      var ast = Output.sources['./contracts/arrayTestcase.sol'].ast;
      var testobject = [ast.nodes[1]];
      var storageTableBuilder = new StorageTableBuilder(testobject);
      storageTableBuilder.build();
      var variableTracker = new VariableTracker(
        storageTableBuilder.storageTable
      );

      // when
      result1 = variableTracker.getInfo('asdb');
      result2 = variableTracker.getInfo('array_boo[56]');

      // then
      expect(result1).equal(-1);
      expect(result2).equal(-1);
    });

    it('show command: input is not array nor mapping when input string is reference form', async function() {
      // given
      var Output = JSON.parse(
        fs.readFileSync('test/dummy/show-state/ast/array_output.json', 'utf-8')
      );
      var ast = Output.sources['./contracts/arrayTestcase.sol'].ast;
      var testobject = [ast.nodes[1]];
      var storageTableBuilder = new StorageTableBuilder(testobject);
      storageTableBuilder.build();
      var variableTracker = new VariableTracker(
        storageTableBuilder.storageTable
      );

      // when
      result1 = variableTracker.getInfo('array_bool[2][3][4]');

      // then
      expect(result1).equal(-1);
    });

    it('show command : check long dimension error', async function() {
      // given
      var Output = JSON.parse(
        fs.readFileSync(
          'test/dummy/show-state/ast/dynamicVar_output.json',
          'utf-8'
        )
      );
      var ast = Output.sources['./contracts/dynamicVarTestcase.sol'].ast;
      var testobject = [ast.nodes[1]];
      var storageTableBuilder = new StorageTableBuilder(testobject);
      storageTableBuilder.build();
      var variableTracker = new VariableTracker(
        storageTableBuilder.storageTable
      );

      // when
      result1 = variableTracker.getInfo('darray4[0][1][2][3]');
      result2 = variableTracker.getInfo('map2[key1][key2][key3]');

      // then
      expect(result1).equal(-1);
      expect(result2).equal(-1);
    });
  });

  describe('# final variable value test', function() {
    var vvispState;
    this.timeout(30000);

    before(async function() {
      const TEST_PATH = path.join('./', 'test', 'dummy', 'show-state');
      process.chdir(TEST_PATH);

      fs.exists('./state.vvisp.json', function(exists) {
        if (exists) {
          execSync('rm state.vvisp.json');
        }
      });
      console.log(execSync('vvisp deploy-service').toString());

      vvispState = JSON.parse(fs.readFileSync('./state.vvisp.json', 'utf-8'));
    });

    after(function() {});

    it('elementTestcase', async function() {
      var contract = 'elementTestcase';

      // given
      var address = vvispState.contracts[contract].address;
      const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;
      const solcOutput = await utils.compile(srcPath);
      const baseAst = solcOutput.sources[srcPath].ast;
      const linearIds = utils.getLinearContractIds(baseAst, contract);
      const nodesById = utils.getContractNodesById(solcOutput);
      const linearNodes = linearIds.map(id => nodesById[id]);

      // when
      storageTableBuilder = new StorageTableBuilder(linearNodes);
      storageTable = storageTableBuilder.build();
      storageTable = await utils.addVariableValue(storageTable, address, web3);

      // then
      answer = [
        'true',
        '1',
        '40',
        '3',
        '2',
        '1000',
        '23253',
        '0x345ca3e014aaf5dca488057592ee44305d9b3e11',
        '0x111113e014aaf5dca488057592ee44305d9b3e11',
        '0x01',
        '0x0002',
        '0x0002000200020002000200020002000200020002000200020002000200020002',
        '0x0000000000000000000000000000000000000000',
        '0x01',
        '0x000000000000000000000000000000000000000000000000',
        '0x0000000000000000',
        '0x000000000000000000000000000000000000000000000000',
        '0x0000000000000000',
        '0x627974657300000000000000000000000000000000000000000000000000000a',
        '\u0000hello',
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      ];
      storageTable.forEach(function(row, i) {
        expect(row[5]).equal(answer[i]);
      });
    });

    it('arrayTestcase', async function() {
      var contract = 'arrayTestcase';

      // given
      var address = vvispState.contracts[contract].address;
      const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;
      const solcOutput = await utils.compile(srcPath);
      const baseAst = solcOutput.sources[srcPath].ast;
      const linearIds = utils.getLinearContractIds(baseAst, contract);
      const nodesById = utils.getContractNodesById(solcOutput);
      const linearNodes = linearIds.map(id => nodesById[id]);

      // when
      storageTableBuilder = new StorageTableBuilder(linearNodes);
      storageTable = storageTableBuilder.build();
      storageTable = await utils.addVariableValue(storageTable, address, web3);

      // then
      answer = [
        'true',
        'false',
        'true',
        'true',
        'false',
        '-1',
        '-2',
        '-3',
        '-4',
        '-5',
        '-6',
        '-7',
        '-8',
        '-9',
        '-10',
        '-11',
        '-12',
        '-13',
        '-14',
        '-15',
        '-16',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0001',
        '0x0011',
        '0x0111',
        '0x1111',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x00',
        '0x00',
        '0x00',
        '0x000000000000000000000000000000000000000000000000',
        '0x000000000000000000000000000000000000000000000000',
        '0x000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '\u0000apple',
        '\u0000banana',
        '\u0000kiwi',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      ];
      storageTable.forEach(function(row, i) {
        expect(row[5]).equal(answer[i]);
      });
    });

    it('structTestcase', async function() {
      var contract = 'structTestcase';

      // given
      var address = vvispState.contracts[contract].address;
      const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;
      const solcOutput = await utils.compile(srcPath);
      const baseAst = solcOutput.sources[srcPath].ast;
      const linearIds = utils.getLinearContractIds(baseAst, contract);
      const nodesById = utils.getContractNodesById(solcOutput);
      const linearNodes = linearIds.map(id => nodesById[id]);

      // when
      storageTableBuilder = new StorageTableBuilder(linearNodes);
      storageTable = storageTableBuilder.build();
      storageTable = await utils.addVariableValue(storageTable, address, web3);

      // then
      answer = [
        'true',
        '3',
        '0x345ca3e014aaf5dca488057592ee44305d9b3e11',
        '0x0000000000000000000000000000000000000000',
        '0x01',
        '0x000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0100',
        '0x0010',
        '0x1000',
        '0x0000000000001000',
        '0x0000000010001000',
        '0x1011100010001000',
        '0x1001100111011100',
        '0x1000111111111100',
        '0x1000101010111100',
        '0x1000000000000000',
        '0x1111110000001100',
        '0x1000100010101100',
        '0x76657279676f6f64000000000000000000000000000000000000000000000010',
        '\u0000very very great',
        '0x01',
        '0x10',
        '0x00'
      ];

      storageTable.forEach(function(row, i) {
        expect(row[5]).equal(answer[i]);
      });
    });

    it('arrayOfStructTestcase', async function() {
      var contract = 'arrayOfStructTestcase';

      // given
      var address = vvispState.contracts[contract].address;
      const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;
      const solcOutput = await utils.compile(srcPath);
      const baseAst = solcOutput.sources[srcPath].ast;
      const linearIds = utils.getLinearContractIds(baseAst, contract);
      const nodesById = utils.getContractNodesById(solcOutput);
      const linearNodes = linearIds.map(id => nodesById[id]);

      // when
      storageTableBuilder = new StorageTableBuilder(linearNodes);
      storageTable = storageTableBuilder.build();
      storageTable = await utils.addVariableValue(storageTable, address, web3);

      // then
      answer = [
        '0x737765657400000000000000000000000000000000000000000000000000000a',
        '\u0000I love beer..',
        '0x01',
        '0x02',
        '0x03',
        '0x04',
        '0x05',
        '0x06',
        '0x07',
        '0x08',
        '0x09',
        '0x737069637900000000000000000000000000000000000000000000000000000a',
        '\u0000I hate coffee!!',
        '0x0a',
        '0x0b',
        '0x0c',
        '0x0d',
        '0x0e',
        '0x0f',
        '0xff',
        '0xef',
        '0x2b'
      ];

      storageTable.forEach(function(row, i) {
        expect(row[5]).equal(answer[i]);
      });
    });

    it('dynamicVarTestcase', async function() {
      var contract = 'dynamicVarTestcase';

      // given
      var address = vvispState.contracts[contract].address;
      const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;
      const solcOutput = await utils.compile(srcPath);
      const baseAst = solcOutput.sources[srcPath].ast;
      const linearIds = utils.getLinearContractIds(baseAst, contract);
      const nodesById = utils.getContractNodesById(solcOutput);
      const linearNodes = linearIds.map(id => nodesById[id]);
      storageTableBuilder = new StorageTableBuilder(linearNodes);
      storageTable = storageTableBuilder.build();
      storageTable = await utils.addVariableValue(storageTable, address, web3);

      // when
      tests = [
        'darray1[0]',
        'darray1[1]',
        'darray1[2]',
        'darray1[3]',
        'darray2[0][0]',
        'darray2[0][1]',
        'darray2[0][2]',
        'darray2[1][0]',
        'darray2[1][1]',
        'darray2[2][0]',
        'darray2[2][1]',
        'darray2[2][2]',
        'darray2[2][3]',
        'darray3[0][0][0]',
        'darray3[0][0][1]',
        'darray3[0][1][0]',
        'darray3[1][0][0]',
        'darray3[1][1][0]',
        'darray3[1][1][1]',
        'darray3[2][0][0]',
        'darray3[2][0][1]',
        'darray3[2][0][2]',
        'darray3[2][1][0]',
        'darray4[0][0][0]',
        'darray4[0][0][1]',
        'darray4[0][0][2]',
        'darray4[0][1][0]',
        'darray4[0][1][1]',
        'darray4[0][1][2]',
        'map1[zero]',
        'map1[one]',
        'map1[two]',
        'map2[2][4]',
        'map2[3][8]',
        'map2[4][7]',
        'mapdarray[0][36][key1][0][0][0]',
        'mapdarray[0][36][key1][0][0][1]',
        'mapdarray[0][36][key1][0][1][0]',
        'mapdarray[0][36][key1][0][1][1]',
        'mapdarray[0][36][key1][0][2][0]',
        'mapdarray[0][36][key1][0][2][1]',
        's1[0].darray5[0][0][0][0]',
        's1[0].darray5[0][0][0][1]',
        's1[0].darray5[0][0][1][0]',
        's1[0].darray5[0][0][1][1]',
        's1[0].darray5[0][0][2][0]',
        's1[0].darray5[0][0][2][1]',
        's1[1].darray5[1][0][0][0]',
        's1[1].darray5[1][0][0][1]',
        's1[1].darray5[1][0][1][0]',
        's1[1].darray5[1][0][1][1]',
        's1[1].darray5[1][0][2][0]',
        's1[1].darray5[1][0][2][1]'
      ];
      answer = [
        '430',
        '23',
        '123',
        '44',
        '31',
        '32',
        '33',
        '11',
        '12',
        '21',
        '22',
        '23',
        '24',
        '-1',
        '-2',
        '-3',
        '-4',
        '-5',
        '-6',
        '-7',
        '-8',
        '-9',
        '10',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '0',
        '1',
        '2',
        '8',
        '24',
        '28',
        '-1',
        '-2',
        '-3',
        '-4',
        '-5',
        '-6',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11'
      ];

      var variableTracker = new VariableTracker(
        storageTableBuilder.storageTable
      );
      for (var i = 0; i < tests.length; i++) {
        var table = variableTracker.getInfo(tests[i]);
        table = await utils.addVariableValue(table, address, web3);
        // then
        expect(table[0][5]).equal(answer[i]);
      }
    });
  });
});

function expect_structSymbolTable(structTypeName, symbolTable, getTypeSize) {
  switch (structTypeName) {
    case 'struct1':
      expect_symbolTable_equal('var_bool', 'bool', 0, symbolTable, getTypeSize);

      expect_symbolTable_equal('var_int8', 'int8', 1, symbolTable, getTypeSize);
      expect_symbolTable_equal(
        'var_address',
        'address',
        2,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_contract',
        'contract structTestcase',
        3,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_enum',
        'enum structTestcase.myEnum',
        4,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_f1',
        'function (bool) external',
        5,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_mapping',
        'mapping(uint256 => uint256)',
        6,
        symbolTable,
        getTypeSize
      );
      break;
    case 'struct2':
      expect_symbolTable_equal(
        'var_bytes2[2]',
        'bytes2',
        2,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_bytes32[2][2]',
        'bytes32',
        11,
        symbolTable,
        getTypeSize
      );
      break;
    case 'struct3':
      expect_symbolTable_equal(
        'is2.var_bytes',
        'bytes',
        0,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'is2.var_string',
        'string',
        1,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'is2.is1.var_byte[0][0]',
        'bytes1',
        2,
        symbolTable,
        getTypeSize
      );
      break;
    case 'inStruct1':
      expect_symbolTable_equal(
        'var_byte[0][0]',
        'bytes1',
        0,
        symbolTable,
        getTypeSize
      );
      break;
    case 'inStruct2':
      expect_symbolTable_equal(
        'var_bytes',
        'bytes',
        0,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_string',
        'string',
        1,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'is1.var_byte[0][0]',
        'bytes1',
        2,
        symbolTable,
        getTypeSize
      );
      break;
    default:
      throw 'There is invalid type in table of struct.';
  }
}

function expect_arrayStructSymbolTable(
  structTypeName,
  symbolTable,
  getTypeSize
) {
  switch (structTypeName) {
    case 'struct1':
      expect_symbolTable_equal(
        'is2.var_bytes',
        'bytes',
        0,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'is2.var_string',
        'string',
        1,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'is2.is1[0].var_byte[0][0]',
        'bytes1',
        2,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'is2.is1[1].var_byte[0][0]',
        'bytes1',
        5,
        symbolTable,
        getTypeSize
      );
      break;
    case 'inStruct1':
      expect_symbolTable_equal(
        'var_byte[0][0]',
        'bytes1',
        0,
        symbolTable,
        getTypeSize
      );
      break;
    case 'inStruct2':
      expect_symbolTable_equal(
        'var_bytes',
        'bytes',
        0,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'var_string',
        'string',
        1,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'is1[0].var_byte[0][0]',
        'bytes1',
        2,
        symbolTable,
        getTypeSize
      );
      expect_symbolTable_equal(
        'is1[1].var_byte[0][0]',
        'bytes1',
        5,
        symbolTable,
        getTypeSize
      );
      break;
    default:
      throw 'There is invashowStatelid type in table of struct.';
  }
}

function expect_symbolTable_equal(
  var_name,
  type,
  seq_no,
  symbolTable,
  getTypeSize
) {
  expect(symbolTable.get()[var_name]).to.deep.equal([
    type,
    getTypeSize(type),
    seq_no
  ]);
}
function expect_variable_not_in_symbolTable(var_name, astParser) {
  expect(astParser.symbolTable.get()[var_name]).to.deep.equal(undefined);
}
function expect_symbolTable_equal_with_index(
  var_name,
  type,
  seq_no,
  index,
  startByte,
  symbolTable,
  getTypeSize
) {
  expect(symbolTable.get()[var_name]).to.deep.equal([
    type,
    getTypeSize(type),
    seq_no,
    index,
    startByte
  ]);
}
