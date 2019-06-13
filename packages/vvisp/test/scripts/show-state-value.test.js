const showState = require('../../scripts/show-state')
const StorageTableBuilder = require('../../scripts/show-state/storageTableBuilder');
const VariableTracker = require("../../scripts/show-state/variableTracker")

const chai = require('chai');
chai.use(require('chai-as-promised')).should();
const expect = chai.expect;
const fs = require('fs');
const {execSync} = require('child_process')
const path = require('path');
const options = require('../../scripts/utils/injectConfig')();
const web3 = options.web3


describe('# final variable value test', function() {
    var vvispState;
    this.timeout(30000);


    before(async function() {

      const TEST_PATH = path.join('./', 'test', 'dummy', 'show-state')
      process.chdir(TEST_PATH);

      fs.exists('./state.vvisp.json', function(exists) {
        if (exists) {
          execSync('rm state.vvisp.json')
        }
      });
      console.log(execSync('vvisp deploy-service').toString())


      vvispState = JSON.parse(fs.readFileSync('./state.vvisp.json', 'utf-8'));
     
    });

    after(function() {});

    it('elementTestcase', async function() {

      var contract = 'elementTestcase'

      // given
      var address = vvispState.contracts[contract].address;
      const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;
      const solcOutput = await showState.compile(srcPath);
      const baseAst = solcOutput.sources[srcPath].ast;
      const linearIds = showState.getLinearContractIds(baseAst, contract);
      const nodesById = showState.getContractNodesById(solcOutput);
      const linearNodes = linearIds.map(id => nodesById[id]);

      // when
      storageTableBuilder = new StorageTableBuilder(linearNodes);
      storageTable = storageTableBuilder.build();
      storageTable = await showState.addVariableValue(storageTable, address, web3);

      // then
      answer=['true', 1, 40, 3, 2, 1000, 23253,
              "0x345ca3e014aaf5dca488057592ee44305d9b3e11",
              '0x111113e014aaf5dca488057592ee44305d9b3e11',
              '0x01', '0x0002',
              '0x0002000200020002000200020002000200020002000200020002000200020002',
              '0x0000000000000000000000000000000000000000',
              '0x01', '0x000000000000000000000000000000000000000000000000', 
              '0x0000000000000000', 
              '0x000000000000000000000000000000000000000000000000', 
              '0x0000000000000000',
              '0x627974657300000000000000000000000000000000000000000000000000000a',
              "\u0000hello", '0x0000000000000000000000000000000000000000000000000000000000000000'
              ]
      storageTable.forEach(function(row,i) {
        expect(row[5]).equal(answer[i])
      });
    });


    it('arrayTestcase', async function() {

      var contract = 'arrayTestcase'

      // given
      var address = vvispState.contracts[contract].address;
      const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;
      const solcOutput = await showState.compile(srcPath);
      const baseAst = solcOutput.sources[srcPath].ast;
      const linearIds = showState.getLinearContractIds(baseAst, contract);
      const nodesById = showState.getContractNodesById(solcOutput);
      const linearNodes = linearIds.map(id => nodesById[id]);

      // when
      storageTableBuilder = new StorageTableBuilder(linearNodes);
      storageTable = storageTableBuilder.build();
      storageTable = await showState.addVariableValue(storageTable, address, web3);

      // then
      answer=['true', 'false', 'true', 'true', 'false',
              -1, -2, -3, -4, -5, -6, -7, -8, -9,
              -10, -11, -12, -13, -14, -15, -16,
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
              11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
              21, 22, 23, 24, 
              '0x0000000000000000000000000000000000000000', 
              '0x0000000000000000000000000000000000000000', 
              '0x0000000000000000000000000000000000000000',
              '0x0001', '0x0011', '0x0111', '0x1111',
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
              "\u0000apple", "\u0000banana", "\u0000kiwi",
              '0x0000000000000000000000000000000000000000000000000000000000000000', 
              '0x0000000000000000000000000000000000000000000000000000000000000000', 
              '0x0000000000000000000000000000000000000000000000000000000000000000'
              ]
      storageTable.forEach(function(row,i) {
        expect(row[5]).equal(answer[i])
      });
    });

    it('structTestcase', async function() {

      var contract = 'structTestcase'

      // given
      var address = vvispState.contracts[contract].address;
      const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;
      const solcOutput = await showState.compile(srcPath);
      const baseAst = solcOutput.sources[srcPath].ast;
      const linearIds = showState.getLinearContractIds(baseAst, contract);
      const nodesById = showState.getContractNodesById(solcOutput);
      const linearNodes = linearIds.map(id => nodesById[id]);

      // when
      storageTableBuilder = new StorageTableBuilder(linearNodes);
      storageTable = storageTableBuilder.build();
      storageTable = await showState.addVariableValue(storageTable, address, web3);

      // then
      answer=['true', 3, '0x345ca3e014aaf5dca488057592ee44305d9b3e11',
              '0x0000000000000000000000000000000000000000', '0x01', 
              '0x000000000000000000000000000000000000000000000000',
              '0x0000000000000000000000000000000000000000000000000000000000000000',
              '0x0100', '0x0010', '0x1000', '0x0000000000001000', '0x0000000010001000',
              '0x1011100010001000', '0x1001100111011100','0x1000111111111100',
              '0x1000101010111100', '0x1000000000000000', '0x1111110000001100',
              '0x1000100010101100', "0x76657279676f6f64000000000000000000000000000000000000000000000010", 
              "\u0000very very great",
              '0x01', '0x10', '0x00'
              ]

      storageTable.forEach(function(row,i) {
        expect(row[5]).equal(answer[i])
      });
    });


    it('arrayOfStructTestcase', async function() {

      var contract = 'arrayOfStructTestcase'

      // given
      var address = vvispState.contracts[contract].address;
      const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;
      const solcOutput = await showState.compile(srcPath);
      const baseAst = solcOutput.sources[srcPath].ast;
      const linearIds = showState.getLinearContractIds(baseAst, contract);
      const nodesById = showState.getContractNodesById(solcOutput);
      const linearNodes = linearIds.map(id => nodesById[id]);

      // when
      storageTableBuilder = new StorageTableBuilder(linearNodes);
      storageTable = storageTableBuilder.build();
      storageTable = await showState.addVariableValue(storageTable, address, web3);

      // then
      answer=["0x737765657400000000000000000000000000000000000000000000000000000a", 
              "\u0000I love beer..", '0x01', '0x02',
              '0x03', '0x04', '0x05', '0x06', '0x07', '0x08',
              '0x09', '0x737069637900000000000000000000000000000000000000000000000000000a', 
              '\u0000I hate coffee!!', '0x0a',
              '0x0b', '0x0c', '0x0d', '0x0e', '0x0f', '0xff',
              '0xef', '0x2b'
              ]


      storageTable.forEach(function(row,i) {
        expect(row[5]).equal(answer[i])
      });
    });


    it('dynamicVarTestcase', async function() {

      var contract = 'dynamicVarTestcase'

      // given
      var address = vvispState.contracts[contract].address;
      const srcPath = `./contracts/${vvispState.contracts[contract].fileName}`;
      const solcOutput = await showState.compile(srcPath);
      const baseAst = solcOutput.sources[srcPath].ast;
      const linearIds = showState.getLinearContractIds(baseAst, contract);
      const nodesById = showState.getContractNodesById(solcOutput);
      const linearNodes = linearIds.map(id => nodesById[id]);
      storageTableBuilder = new StorageTableBuilder(linearNodes);
      storageTable = storageTableBuilder.build();
      storageTable = await showState.addVariableValue(storageTable, address, web3);

      // when
      tests = [
        "darray1[0]","darray1[1]","darray1[2]","darray1[3]",
        "darray3[0][0][0]",
        "darray3[0][0][1]",
        "darray3[0][1][0]",
        "darray3[1][0][0]",
        "darray3[1][1][0]",
        "darray3[1][1][1]",
        "darray3[2][0][0]",
        "darray3[2][0][1]",
        "darray3[2][0][2]",
        "darray3[2][1][0]"
      ]
      answer=[
        430,23,123,44,-1,-2,-3,-4,-5,-6,-7,-8,-9,10
      ]

      var variableTracker = new VariableTracker(storageTableBuilder.storageTable);
      tests.forEach(async function(variable,i) {

        var table = variableTracker.getInfo(variable);
        table = await showState.addVariableValue(table, address, web3);
        // then
        expect(table[5]).equal(answer[i])
      });


      

      
    });





  });