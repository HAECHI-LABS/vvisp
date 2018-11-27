const chai = require('chai');
const assert = chai.assert;
chai.use(require('chai-as-promised')).should();
require('dotenv').config();

const deployService = require('../../../scripts/deploy-service/');
const compareConfigAndState = require('../../../scripts/deploy-service/preProcess/compareConfigAndState');
const {
  PENDING_STATE,
  SERVICE_PATH,
  STATE_PATH
} = require('../../../scripts/deploy-service/constants');
const { hasInitArgs } = require('../../../scripts/deploy-service/utils');
const {
  forIn,
  getWeb3,
  mnemonicToPrivateKey,
  privateKeyToAddress
} = require('@haechi-labs/vvisp-utils');
const web3 = getWeb3();
const path = require('path');
const fs = require('fs-extra');
const Mitm = require('mitm');

const SENDER = privateKeyToAddress(mnemonicToPrivateKey(process.env.MNEMONIC));
const SERVICE1 = path.join('./test/dummy/service1.json');
const SERVICE2 = path.join('./test/dummy/service2.json');
const STATE1 = path.join('./test/dummy/state1.json');
const NU_SERVICE1 = path.join('./test/dummy/justNonUpgradeables.service1.json');
const NU_SERVICE2 = path.join('./test/dummy/justNonUpgradeables.service2.json');
const NU_STATE1 = path.join('./test/dummy/justNonUpgradeables.state1.json');
const U_SERVICE1 = path.join('./test/dummy/justUpgradeables.service1.json');
const U_SERVICE2 = path.join('./test/dummy/justUpgradeables.service2.json');
const U_STATE1 = path.join('./test/dummy/justUpgradeables.state1.json');

fs.removeSync(SERVICE_PATH);
fs.removeSync(STATE_PATH);
const { deploy: deployNum, upgrade: upgradeNum } = getTxcount(
  SERVICE1,
  SERVICE2,
  STATE1
);
const { deploy: nuDeployNum, upgrade: nuUpgradeNum } = getTxcount(
  NU_SERVICE1,
  NU_SERVICE2,
  NU_STATE1
);
const { deploy: uDeployNum, upgrade: uUpgradeNum } = getTxcount(
  U_SERVICE1,
  U_SERVICE2,
  U_STATE1
);

describe('# deploy-service process test', function() {
  this.timeout(50000);
  describe('# whole process test', function() {
    afterEach(function() {
      checkRightState();
    });
    describe('# just nonUpgradeables case', function() {
      setWholeProcess(NU_SERVICE1, NU_SERVICE2);
    });
    describe('# just upgradeables case', function() {
      setWholeProcess(U_SERVICE1, U_SERVICE2);
    });
    describe('# mixed case', function() {
      setWholeProcess(SERVICE1, SERVICE2);
    });
  });

  describe('# resuming process test', function() {
    afterEach(function() {
      checkRightState();
      fs.removeSync(SERVICE_PATH);
      fs.removeSync(STATE_PATH);
    });
    describe('# just nonUpgradeables case', function() {
      setResumingProcess(NU_SERVICE1, NU_SERVICE2, nuDeployNum, nuUpgradeNum);
    });
    describe('# just upgradeables case', function() {
      setResumingProcess(U_SERVICE1, U_SERVICE2, uDeployNum, uUpgradeNum);
    });
    describe('# mixed case', function() {
      setResumingProcess(SERVICE1, SERVICE2, deployNum, upgradeNum);
    });
  });
});

function checkRightState() {
  const service = fs.readJsonSync(SERVICE_PATH);
  const state = fs.readJsonSync(STATE_PATH);

  Object.keys(state).should.have.lengthOf(3);
  state.serviceName.should.be.equal(service.serviceName);
  web3.utils.isAddress(state.registry).should.equal(true);

  const contracts = state.contracts;
  forIn(contracts, (contract, name) => {
    service.contracts.hasOwnProperty(name).should.equal(true);
    if (contract.upgradeable) {
      Object.keys(contract).should.have.lengthOf(4);
      contract.upgradeable.should.equal(true);
      web3.utils.isAddress(contract.proxy).should.equal(true);
    } else {
      Object.keys(contract).should.have.lengthOf(2);
    }
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
    resultNumber++; // register
  } else {
    const file = fs.readJsonSync(STATE_PATH);
    forIn(file, (object, name) => {
      stateClone[name] = object;
    });
  }

  const targets = compareConfigAndState(config.contracts, stateClone);

  let nonUpgradeableExists = false;
  let upgradeableExists = false;

  forIn(targets, contract => {
    if (contract.pending === PENDING_STATE[0]) {
      if (contract.upgradeable === true) {
        if (!upgradeableExists) {
          upgradeableExists = true;
        }
        resultNumber += 2; // proxy and business
      } else {
        if (!nonUpgradeableExists) {
          nonUpgradeableExists = true;
        }
        resultNumber++; // nonUpgradeables
        if (hasInitArgs(contract)) {
          resultNumber++; // init Tx
        }
      }
    } else {
      resultNumber++; // just upgrade
    }
  });

  if (upgradeableExists) {
    resultNumber += 2; // upgradeAll, registerFileNames
  }
  if (nonUpgradeableExists) {
    resultNumber++; // registerNonUpgradeables
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
