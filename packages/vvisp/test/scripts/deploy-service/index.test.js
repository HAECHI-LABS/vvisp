const chai = require('chai');
const assert = chai.assert;
chai.use(require('chai-as-promised')).should();

const deployService = require('../../../scripts/deploy-service/');
const compareConfigAndState = require('../../../scripts/deploy-service/preProcess/compareConfigAndState');
const { PENDING_STATE } = require('../../../scripts/deploy-service/constants');
const { SERVICE_PATH, STATE_PATH, TEST } = require('../../../config/Constant');
const { hasInit } = require('../../../scripts/deploy-service/utils');
const {
  Config,
  forIn,
  web3Store,
  privateKeyToAddress
} = require('@haechi-labs/vvisp-utils');
const path = require('path');
const fs = require('fs-extra');
const Mitm = require('mitm');

const config = Config.get();

const SENDER = privateKeyToAddress(config.from);
const SERVICE1 = path.join('./test/dummy/service1.json');
const SERVICE2 = path.join('./test/dummy/service2.json');
const STATE1 = path.join('./test/dummy/state1.json');
const N_R_SERVICE1 = path.join('./test/dummy/noRegistry.service1.json');
const N_R_SERVICE2 = path.join('./test/dummy/noRegistry.service2.json');
const N_R_STATE1 = path.join('./test/dummy/noRegistry.state1.json');

fs.removeSync(SERVICE_PATH);
fs.removeSync(STATE_PATH);
const { deploy: deployNum, upgrade: upgradeNum } = getTxcount(
  SERVICE1,
  SERVICE2,
  STATE1
);
const { deploy: nrDeployNum, upgrade: nrUpgradeNum } = getTxcount(
  N_R_SERVICE1,
  N_R_SERVICE2,
  N_R_STATE1
);

let web3;

describe('# deploy-service process test', function() {
  this.timeout(50000);
  before(function() {
    web3Store.setWithURL(TEST.URL);
    web3 = web3Store.get();
    web3Store.delete();
    Config.delete();
  });

  beforeEach(function() {
    web3Store.delete();
    Config.delete();
  });

  after(function() {
    web3Store.delete();
    Config.delete();
  });

  describe('# whole process test', function() {
    afterEach(function() {
      checkRightState();
    });

    describe('# normal case', function() {
      setWholeProcess(SERVICE1, SERVICE2);
    });

    describe('# no registry case', function() {
      setWholeProcess(N_R_SERVICE1, N_R_SERVICE2);
    });
  });

  describe('# resuming process test', function() {
    afterEach(function() {
      checkRightState();
      fs.removeSync(SERVICE_PATH);
      fs.removeSync(STATE_PATH);
    });

    describe('# normal case', function() {
      setResumingProcess(SERVICE1, SERVICE2, deployNum, upgradeNum);
    });

    describe('# no registry case', function() {
      setResumingProcess(N_R_SERVICE1, N_R_SERVICE2, nrDeployNum, nrUpgradeNum);
    });
  });

  describe('# force option test', function() {
    beforeEach(async function() {
      fs.copySync(SERVICE1, SERVICE_PATH);
      this.waitingTxNum = getWaitingTxNum();
      await deployService({ silent: true });
    });

    it('should success forced deployment', async function() {
      const startTxCount = await web3.eth.getTransactionCount(SENDER);
      await deployService({ force: true, silent: true });
      const endTxCount = await web3.eth.getTransactionCount(SENDER);
      (endTxCount - startTxCount).should.equal(this.waitingTxNum);
    });

    afterEach(function() {
      fs.removeSync(SERVICE_PATH);
      fs.removeSync(STATE_PATH);
    });
  });
});

function checkRightState() {
  const service = fs.readJsonSync(SERVICE_PATH);
  const state = fs.readJsonSync(STATE_PATH);

  Object.keys(state).should.have.lengthOf(3);
  state.serviceName.should.be.equal(service.serviceName);

  (
    web3.utils.isAddress(state.registry) || state.registry === 'noRegistry'
  ).should.equal(true);

  const contracts = state.contracts;
  forIn(contracts, (contract, name) => {
    service.contracts.hasOwnProperty(name).should.equal(true);
    Object.keys(contract).should.have.lengthOf(2);
    web3.utils.isAddress(contract.address).should.equal(true);
    const fileName = path.parse(service.contracts[name].path).base;
    contract.fileName.should.equal(fileName);
  });
}

function getWaitingTxNum() {
  let stateClone = {};
  const config = fs.readJsonSync(SERVICE_PATH);
  let resultNumber = 0;

  if (!fs.existsSync(STATE_PATH)) {
    stateClone.notUpgrading = true;
    stateClone.contracts = {};
    stateClone.serviceName = config.serviceName;
    if (!config.registry) {
      stateClone.registry = 'noRegistry';
    } else {
      resultNumber++; // registry
    }
  } else {
    const file = fs.readJsonSync(STATE_PATH);
    forIn(file, (object, name) => {
      stateClone[name] = object;
    });
  }

  const compileInformation = compareConfigAndState(
    config.contracts,
    stateClone
  );

  let targetExists = false;

  forIn(compileInformation.targets, contract => {
    if (contract.pending === PENDING_STATE[0]) {
      if (!targetExists) {
        targetExists = true;
      }
      resultNumber++;
      if (hasInit(contract)) {
        resultNumber++; // init Tx
      }
    } else {
      resultNumber++; // just upgrade
    }
  });

  if (targetExists && stateClone.registry !== 'noRegistry') {
    resultNumber++; // registerContractInfo
  }
  return resultNumber;
}

async function runTxStopper(stopNum, endTx) {
  const startCount = await web3.eth.getTransactionCount(SENDER);
  while (1) {
    const currentTx = await web3.eth.getTransactionCount(SENDER);
    if (currentTx - startCount === stopNum) {
      const mitm = Mitm();
      mitm.on('request', function(req, res) {
        res.end();
        mitm.disable();
      });
      break;
    }
    if (currentTx - startCount === endTx) {
      console.log('noooooooo');
      break;
    }
  }
}

function setWholeProcess(service1, service2) {
  before(function() {
    fs.copySync(service1, SERVICE_PATH);
    this.waitingTxNum = getWaitingTxNum();
  });

  it('should success deploy process', async function() {
    const startTxCount = await web3.eth.getTransactionCount(SENDER);
    await deployService({ silent: true });
    const endTxCount = await web3.eth.getTransactionCount(SENDER);
    (endTxCount - startTxCount).should.equal(this.waitingTxNum);
  });

  it('should success upgrade process', async function() {
    fs.copySync(service2, SERVICE_PATH);
    this.waitingTxNum = getWaitingTxNum();
    const startTxCount = await web3.eth.getTransactionCount(SENDER);
    await deployService({ silent: true });
    const endTxCount = await web3.eth.getTransactionCount(SENDER);
    (endTxCount - startTxCount).should.equal(this.waitingTxNum);
  });

  after(function() {
    fs.removeSync(SERVICE_PATH);
    fs.removeSync(STATE_PATH);
  });
}

function getTxcount(service1, service2, state1) {
  fs.copySync(service1, SERVICE_PATH);
  const deploy = getWaitingTxNum();
  fs.copySync(service2, SERVICE_PATH);
  fs.copySync(state1, STATE_PATH);
  const upgrade = getWaitingTxNum();
  fs.removeSync(SERVICE_PATH);
  fs.removeSync(STATE_PATH);
  return { deploy, upgrade };
}

function setResumingProcess(service1, service2, deployTxCount, upgradeTxCount) {
  describe('# deploy process', function() {
    beforeEach(function() {
      fs.copySync(service1, SERVICE_PATH);
    });

    for (let i = 1; i < deployTxCount; i++) {
      it(`should resume when paused after ${i} txs`, async function() {
        runTxStopper(i, deployTxCount);
        await deployService({ silent: true });
        assert.notEqual(fs.readJsonSync(STATE_PATH).paused, undefined);
        await deployService({ silent: true });
      });
    }
  });

  describe('# upgrade process', function() {
    beforeEach(async function() {
      fs.copySync(service1, SERVICE_PATH);
      await deployService({ silent: true });
      fs.copySync(service2, SERVICE_PATH);
    });

    for (let i = 1; i < upgradeTxCount; i++) {
      it(`should resume when paused after ${i} txs`, async function() {
        runTxStopper(i, deployTxCount);
        await deployService({ silent: true });
        assert.notEqual(fs.readJsonSync(STATE_PATH).paused, undefined);
        await deployService({ silent: true });
      });
    }
  });
}
