const rewire = require('rewire');
const chai = require('chai');
const path = require('path');
const chalk = require('chalk');
const bddStdin = require('bdd-stdin');

chai.use(require('chai-as-promised')).should();

const { forIn } = require('@haechi-labs/vvisp-utils');

const consoleTest = rewire('../../scripts/console.js');

describe('console', async function() {
  before('set ganache', function() {
    process.env.MNEMONIC =
      'agree layer merit wink quality aim order dial inform weasel melt arrange';
    process.env.PORT = '8545';
    process.env.NETWORK = 'local';

    const ganache = require('ganache-core');
    this.server = ganache.server({
      mnemonic: process.env.MNEMONIC,
      default_balance_ether: 100
    });
    this.server.listen(process.env.PORT, function(err, blockchain) {
      if (err) {
        should.fail();
      }
    });
  });

  after('teardown ganache', function() {
    this.server.close();
  });

  describe('parseArgs', function() {
    const parseArgs = consoleTest.__get__('parseArgs');

    it('should parse args string', function() {
      const args = 'HaechiV1 freeze';
      const expected = ['HaechiV1', 'freeze'];

      r = parseArgs(args);

      for (i = 0; i < r.length; i++) {
        r[i].should.be.equal(expected[i]);
      }
      r.length.should.be.equal(expected.length);
    });
  });

  describe('extractContractsApi', function() {
    const extractContractsApi = consoleTest.__get__('extractContractsApi');

    before('create apis', function() {
      const testScriptPath = path.join(
        __dirname,
        '..',
        'dummy',
        'testContractApis'
      );
      this.apis = extractContractsApi(testScriptPath);
    });

    it('should have contract functions', function() {
      forIn(this.apis, Contract => {
        Contract.should.be.a('function');
      });
    });

    it('should have right name of contracts', function() {
      const expectedContractsName = ['MainToken', 'SaleManager'];
      let i = 0;
      for (const key of Object.keys(this.apis)) {
        key.should.be.equal(expectedContractsName[i]);
        i++;
      }
    });

    it('should have right number of contracts', function() {
      Object.keys(this.apis).length.should.be.equal(2);
    });
  });

  describe('setApiAddress', function() {
    const setApiAddress = consoleTest.__get__('setApiAddress');

    it('should set correct address', function() {
      const stateFile = path.join(
        __dirname,
        '..',
        'dummy',
        'test.state.vvisp.json'
      );
      const dummy_api = {
        MainToken: {},
        SaleManager: {}
      };
      const expectedAddress = {
        MainToken: '0xa0ff2297A8690383784d5A4723d72F8A2f5480D4',
        SaleManager: '0x3FcE06688555F67962978B3Eb44805849A4A8895'
      };

      const state = setApiAddress(dummy_api, stateFile);

      state['MainToken']['address'].should.be.equal(
        expectedAddress['MainToken']
      );
      state['SaleManager']['address'].should.be.equal(
        expectedAddress['SaleManager']
      );
    });

    it('should throw an error when the state file does not exist', function() {
      const invalidStateFile = path.join(__dirname, '..', 'dummy', 'fake.json');
      try {
        setApiAddress({}, invalidStateFile);
        should.fail();
      } catch (err) {
        err.code.should.be.equal('ENOENT');
      }
    });

    it('should throw an error when no contracts in the state file.', function() {
      const invalidStateFile = path.join(
        __dirname,
        '..',
        'dummy',
        'test.invalid_state.vvisp.json'
      );
      try {
        setApiAddress({}, invalidStateFile);
        should.fail();
      } catch (err) {
        err.message.should.be.equal(
          'There are no contracts in the state file.'
        );
      }
    });

    it('should throw an error when no contracts in the state file.', function() {
      const stateFile = path.join(
        __dirname,
        '..',
        'dummy',
        'test.state.vvisp.json'
      );
      const mismatched_dummy_api = {
        MisMatched_MainToken: {},
        MisMatched_SaleManager: {}
      };

      try {
        setApiAddress(mismatched_dummy_api, stateFile);
        should.fail();
      } catch (err) {
        err.message.should.be.equal(
          'Mismatch has occurred between vvisp.state and apis. Please check state.vvisp.json file and contractApis'
        );
      }
    });
  });

  describe('getAddressFromSTDIN', function() {
    const getAddressFromSTDIN = consoleTest.__get__('getAddressFromSTDIN');

    it('should read and store the address from stdin.', async function() {
      const expectedAddress = {
        MainToken: '0xa0ff2297A8690383784d5A4723d72F8A2f5480D4',
        SaleManager: '0x3FcE06688555F67962978B3Eb44805849A4A8895'
      };
      bddStdin(expectedAddress['MainToken'], expectedAddress['SaleManager']);

      const dummy_apis = {
        MainToken: {},
        SaleManager: {}
      };

      const apis = await getAddressFromSTDIN(dummy_apis);
      apis['MainToken']['address'].should.be.equal(
        expectedAddress['MainToken']
      );
      apis['SaleManager']['address'].should.be.equal(
        expectedAddress['SaleManager']
      );
    });
  });

  describe('readLine', function() {
    const readLine = consoleTest.__get__('readLine');

    it('should read one line.', async function() {
      const input = 'hello';
      bddStdin(input);
      const line = await readLine();
      line.should.be.equal(input);
    });
  });

  describe('printApiInfo', function() {
    const getApiInfo = consoleTest.__get__('getApiInfo');

    it('should print api info', function() {
      const dummy_apis = {
        MainToken: {
          address: '0xa0ff2297A8690383784d5A4723d72F8A2f5480D4'
        },
        SaleManager: {
          address: '0x3FcE06688555F67962978B3Eb44805849A4A8895'
        }
      };

      const expectedOutput =
        'Index\t\t\t\tContract\t\t\t\tAddress\n' +
        '[0]\t\t\t\tMainToken\t\t\t\t0xa0ff2297A8690383784d5A4723d72F8A2f5480D4\n' +
        '[1]\t\t\t\tSaleManager\t\t\t\t0x3FcE06688555F67962978B3Eb44805849A4A8895\n';
      getApiInfo(dummy_apis).should.be.equal(expectedOutput);
    });
  });

  describe('ApiCommander', function() {
    const ApiCommander = consoleTest.__get__('ApiCommander');

    it('should exit console when read exit command', async function() {
      bddStdin('exit');
      const commander = new ApiCommander();
      await commander.run().should.be.fulfilled;
    });

    it('should print invalid command message when read invalid command', async function() {
      const expectedOutput = 'invalid command: invalid';

      // mocking console.log to check console output
      console.log = function(msg) {
        msg.should.be.equal(expectedOutput);
      };

      bddStdin('invalid', 'exit');
      const commander = new ApiCommander();
      await commander.run().should.be.fulfilled;
    });
  });

  describe('list', function() {
    const list = consoleTest.__get__('list');

    it('should print invalid message when options are invalid', async function() {
      const expectedOutput = `invalid number of args: should be 0, got 1`;

      // mocking console.log to check console output
      console.log = function(msg) {
        msg.should.be.equal(expectedOutput);
      };

      await list(['hello'], {}).should.be.fulfilled;
    });

    it('should print all available smart contracts and address', async function() {
      const dummy_apis = {
        MainToken: {
          address: '0xa0ff2297A8690383784d5A4723d72F8A2f5480D4'
        },
        SaleManager: {
          address: '0x3FcE06688555F67962978B3Eb44805849A4A8895'
        }
      };
      const expectedOutput =
        'Index\t\t\t\tContract\t\t\t\tAddress\n' +
        '[0]\t\t\t\tMainToken\t\t\t\t0xa0ff2297A8690383784d5A4723d72F8A2f5480D4\n' +
        '[1]\t\t\t\tSaleManager\t\t\t\t0x3FcE06688555F67962978B3Eb44805849A4A8895\n';

      // mocking console.log to check console output
      console.log = function(msg) {
        msg.should.be.equal(expectedOutput);
      };

      await list([], dummy_apis).should.be.fulfilled;
    });
  });

  describe('show', function() {
    const extractContractsApi = consoleTest.__get__('extractContractsApi');
    const show = consoleTest.__get__('show');

    before('create apis', function() {
      const testScriptPath = path.join(
        __dirname,
        '..',
        'dummy',
        'testContractApis'
      );
      this.apis = extractContractsApi(testScriptPath);
    });

    it('should print api method and args', async function() {
      const expectedOutput =
        '\n' +
        '[Method]\t\t\t\t[Args]\n' +
        'mintingFinished                         []\n' +
        'name                                    []\n' +
        'isLock                                  []\n' +
        'totalSupply                             []\n' +
        'isTransferable                          [_addr]\n' +
        'decimals                                []\n' +
        'paused                                  []\n' +
        'balanceOf                               [__owner]\n' +
        'owner                                   []\n' +
        'symbol                                  []\n' +
        'transferableAddresses                   [_input1]\n' +
        'allowance                               [__owner, __spender]\n' +
        'freezeAddresses                         [_input1]\n' +
        'approve                                 [__spender, __value, options]\n' +
        'addFreezableAddress                     [_addr, options]\n' +
        'transferFrom                            [__from, __to, __value, options]\n' +
        'removeFreezableAddress                  [_addr, options]\n' +
        'addTransferableAddresses                [_addrs, options]\n' +
        'addTransferableAddress                  [_addr, options]\n' +
        'unpause                                 [options]\n' +
        'mint                                    [__to, __amount, options]\n' +
        'burn                                    [__value, options]\n' +
        'addFreezableAddresses                   [_addrs, options]\n' +
        'removeTransferableAddresses             [_addrs, options]\n' +
        'decreaseApproval                        [__spender, __subtractedValue, options]\n' +
        'renounceOwnership                       [options]\n' +
        'finishMinting                           [options]\n' +
        'pause                                   [options]\n' +
        'unlock                                  [options]\n' +
        'transfer                                [__to, __value, options]\n' +
        'increaseApproval                        [__spender, __addedValue, options]\n' +
        'removeTransferableAddress               [_addr, options]\n' +
        'transferOwnership                       [_newOwner, options]\n' +
        'removeFreezableAddresses                [_addrs, options]\n';

      // mocking console.log to check console output
      console.log = function(msg) {
        msg.should.be.equal(expectedOutput);
      };

      await show(['MainToken'], this.apis);
    });

    it('should print invalid contract name message', async function() {
      const invalidContractName = 'InvalidTokenName';
      const expectedOutput = "'{0}' contract does not exist".format(
        invalidContractName
      );

      // mocking console.log to check console output
      console.log = function(msg) {
        msg.should.be.equal(expectedOutput);
      };
      await show([invalidContractName], this.apis).should.be.fulfilled;
    });
  });

  // Before call api, the smart contract should be deployed
  describe('call', function() {
    const extractContractsApi = consoleTest.__get__('extractContractsApi');
    const call = consoleTest.__get__('call');

    before('create apis', function() {
      const testScriptPath = path.join(
        __dirname,
        '..',
        'dummy',
        'testContractApis'
      );
      this.apis = extractContractsApi(testScriptPath);
    });

    // it('should call the smart contract api', async function(){
    //   this.apis["MainToken"]["address"] = "0xc95663de3398D74972c16Ad34aCd0c31baa6859e";
    //   const expectedOutput = "Response: Play Company";
    //    // mocking console.log to check console output
    //   console.log = function(msg){
    //     msg.should.be.equal(expectedOutput);
    //   };
    //
    //   await call(["MainToken","name"], this.apis).should.be.fulfilled;
    // });
  });
});
