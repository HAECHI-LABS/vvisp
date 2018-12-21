const chai = require('chai');
chai.use(require('chai-as-promised')).should();

const init = require('../../scripts/init');
const path = require('path');
const fs = require('fs-extra');

describe('# init script test', function() {
  this.timeout(50000);
  const directoryName = 'a8feya73db';
  before(function() {
    fs.ensureDirSync(path.join('./', directoryName));
  });
  after(function() {
    fs.remove(path.join('./', directoryName));
  });

  it('should disallow to initialize in non-empty directory', async function() {
    await init(undefined, { silent: true }).should.be.rejected;
  });

  it('should initialize directory properly', async function() {
    await init(undefined, { directory: directoryName, silent: true }).should.be
      .fulfilled;
  });

  it('should have right directories', function() {
    fs.existsSync(path.join(directoryName, 'contracts')).should.be.equal(true);
    fs.existsSync(
      path.join(directoryName, 'contracts', 'libs')
    ).should.be.equal(true);
    fs.existsSync(
      path.join(directoryName, 'contracts', 'upgradeable')
    ).should.be.equal(true);
    fs.existsSync(path.join(directoryName, 'migrations')).should.be.equal(true);
    fs.existsSync(path.join(directoryName, 'scripts')).should.be.equal(true);
    fs.existsSync(path.join(directoryName, 'test')).should.be.equal(true);
  });

  it('should have right files', function() {
    fs.existsSync(path.join(directoryName, '.babelrc')).should.be.equal(true);
    fs.existsSync(path.join(directoryName, '.env')).should.be.equal(true);
    fs.existsSync(path.join(directoryName, '.gitignore')).should.be.equal(true);
    fs.existsSync(path.join(directoryName, '.solcover.js')).should.be.equal(
      true
    );
    fs.existsSync(path.join(directoryName, '.soliumignore')).should.be.equal(
      true
    );
    fs.existsSync(path.join(directoryName, '.soliumrc.json')).should.be.equal(
      true
    );
    fs.existsSync(path.join(directoryName, 'package.json')).should.be.equal(
      true
    );
    fs.existsSync(
      path.join(directoryName, 'service.vvisp.json')
    ).should.be.equal(true);
    fs.existsSync(
      path.join(directoryName, 'truffle-config.js')
    ).should.be.equal(true);
    fs.existsSync(
      path.join(directoryName, 'contracts', 'Migrations.sol')
    ).should.be.equal(true);
    fs.existsSync(
      path.join(directoryName, 'contracts', 'libs', 'BytesLib.sol')
    ).should.be.equal(true);
    fs.existsSync(
      path.join(directoryName, 'contracts', 'libs', 'Ownable.sol')
    ).should.be.equal(true);
    fs.existsSync(
      path.join(directoryName, 'contracts', 'libs', 'SafeMath.sol')
    ).should.be.equal(true);
    fs.existsSync(
      path.join(
        directoryName,
        'contracts',
        'upgradeable',
        'OwnedUpgradeabilityProxy.sol'
      )
    ).should.be.equal(true);
    fs.existsSync(
      path.join(directoryName, 'contracts', 'upgradeable', 'Proxy.sol')
    ).should.be.equal(true);
    fs.existsSync(
      path.join(directoryName, 'contracts', 'upgradeable', 'Registry.sol')
    ).should.be.equal(true);
    fs.existsSync(
      path.join(
        directoryName,
        'contracts',
        'upgradeable',
        'UpgradeabilityProxy.sol'
      )
    ).should.be.equal(true);
  });
});
