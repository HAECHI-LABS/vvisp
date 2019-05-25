const rewire = require('rewire');
const chai = require('chai');
const path = require('path');
const stdMocks = require('std-mocks');
const bddStdin = require('bdd-stdin');

chai.use(require('chai-as-promised')).should();

const { forIn } = require('@haechi-labs/vvisp-utils');

const consoleTest = rewire('../../scripts/console.js');

describe('# console script test', async function() {
  this.timeout(50000);

  describe('setApi', function() {
    const setApi = consoleTest.__get__('setApi');

    before('create apis', function() {
      const testScriptPath = path.join(
        __dirname,
        '..',
        'dummy',
        'testContractApis'
      );
      this.apis = setApi(testScriptPath);
    });

    it('should have contract functions', function() {
      forIn(this.apis, Contract => {
        Contract.should.be.a('function');
      });
    });

    it('should have right name of contracts', function() {
      const expectedContractsName = ['HaechiV1'];
      let i = 0;
      for (const key of Object.keys(this.apis)) {
        key.should.be.equal(expectedContractsName[i]);
        i++;
      }
    });

    it('should have right number of contracts', function() {
      Object.keys(this.apis).length.should.be.equal(1);
    });

    it('should have abi', function() {
      for (const key of Object.keys(this.apis)) {
        this.apis[key]['abi'].should.not.be.undefined;
        this.apis[key]['abi'].length.should.be.equal(11);
      }
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
        HaechiV1: {},
        VvispRegistry: {}
      };
      const expectedAddress = {
        HaechiV1: '0x688555B34d5A480D4796723d72F8A9A4A889578F',
        VvispRegistry: '0xf7C93afa7C1a294eBb8dEBB3078F376fE0F1F876'
      };

      const state = setApiAddress(dummy_api, stateFile);

      state['HaechiV1']['address'].should.be.equal(expectedAddress['HaechiV1']);
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

    it('should throw an error when mismatched contracts exists in the state file.', function() {
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
          'Mismatch has occurred between state.vvisp.json and apis. Please check state.vvisp.json file and contractApis/'
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
      const pad1 = 10;
      const pad2 = 20;

      const dummy_apis = {
        MainToken: {
          address: '0xa0ff2297A8690383784d5A4723d72F8A2f5480D4'
        },
        SaleManager: {
          address: '0x3FcE06688555F67962978B3Eb44805849A4A8895'
        }
      };

      const expectedOutput =
        'Index'.padEnd(pad1) +
        'Contract'.padEnd(pad2) +
        'Address\n' +
        '[0]'.padEnd(pad1) +
        'MainToken'.padEnd(pad2) +
        '0xa0ff2297A8690383784d5A4723d72F8A2f5480D4\n' +
        '[1]'.padEnd(pad1) +
        'SaleManager'.padEnd(pad2) +
        '0x3FcE06688555F67962978B3Eb44805849A4A8895\n';
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
      const expectedOutput = 'invalid command: invalid\n';
      stdMocks.use();

      bddStdin('invalid', 'exit');
      const commander = new ApiCommander();
      await commander.run().should.be.fulfilled;

      stdMocks.restore();
      const output = stdMocks.flush();
      output.stdout[1].should.be.equal(expectedOutput);
    });
  });

  describe('list', function() {
    const list = consoleTest.__get__('list');

    it('should print invalid message when options are invalid', async function() {
      const expectedOutput = `invalid number of args: should be 0, got 1\n`;
      stdMocks.use();

      await list(['hello'], {}).should.be.fulfilled;

      stdMocks.restore();
      const output = stdMocks.flush();
      output.stdout[0].should.be.equal(expectedOutput);
    });

    it('should print all available smart contracts and address', async function() {
      const pad1 = 10;
      const pad2 = 20;

      const dummy_apis = {
        MainToken: {
          address: '0xa0ff2297A8690383784d5A4723d72F8A2f5480D4'
        },
        SaleManager: {
          address: '0x3FcE06688555F67962978B3Eb44805849A4A8895'
        }
      };
      const expectedOutput =
        'Index'.padEnd(pad1) +
        'Contract'.padEnd(pad2) +
        'Address\n' +
        '[0]'.padEnd(pad1) +
        'MainToken'.padEnd(pad2) +
        '0xa0ff2297A8690383784d5A4723d72F8A2f5480D4\n' +
        '[1]'.padEnd(pad1) +
        'SaleManager'.padEnd(pad2) +
        '0x3FcE06688555F67962978B3Eb44805849A4A8895\n\n';
      stdMocks.use();

      await list([], dummy_apis).should.be.fulfilled;

      stdMocks.restore();
      const output = stdMocks.flush();
      output.stdout[0].should.be.equal(expectedOutput);
    });
  });

  describe('show', function() {
    const setApi = consoleTest.__get__('setApi');
    const show = consoleTest.__get__('show');

    before('create apis', function() {
      const testScriptPath = path.join(
        __dirname,
        '..',
        'dummy',
        'testContractApis'
      );
      this.apis = setApi(testScriptPath);
      this.apis['HaechiV1'].address =
        '0x688555B34d5A480D4796723d72F8A9A4A889578F';
    });

    it('should print api method and args', async function() {
      const expectedOutput =
        '\n' +
        '[Method]'.padEnd(40) +
        '[Args]\n' +
        'velocities                              [_input1]\n' +
        'haechiIds                               [_input1]\n' +
        'distances                               [_input1]\n' +
        'gym                                     []\n' +
        'makeNewHaechi                           [__id, options]\n' +
        'increaseVelocity                        [__haechiId, __diff, options]\n' +
        'run                                     [options]\n' +
        'initialize                              [__gym, options]\n\n';

      stdMocks.use();

      await show(['HaechiV1'], this.apis);

      stdMocks.restore();
      const output = stdMocks.flush();
      output.stdout[0].should.be.equal(expectedOutput);
    });

    it('should print invalid contract name message', async function() {
      const invalidContractName = 'InvalidTokenName';
      const expectedOutput = "'{0}' contract does not exist\n".format(
        invalidContractName
      );
      stdMocks.use();

      await show([invalidContractName], this.apis).should.be.fulfilled;

      stdMocks.restore();
      const output = stdMocks.flush();
      output.stdout[0].should.be.equal(expectedOutput);
    });
  });
});
