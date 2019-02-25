const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised')).should();

const path = require('path');
const fs = require('fs-extra');

const { checkServiceFileExist } = require('../../bin/error');
const { SERVICE_PATH, SERVICE_FILE } = require('../../config/Constant');

describe('# error test', function() {
  this.timeout(50000);

  describe('checkServiceFileExist()', function() {
    beforeEach(function() {
      fs.removeSync(path.join(SERVICE_PATH));
    });

    it(`should throw error when ${SERVICE_FILE} file does not exist`, function() {
      expect(() => checkServiceFileExist()).to.throw(
        `${SERVICE_FILE} file does not exist`
      );
    });

    it(`should not throw error when ${SERVICE_FILE} exists`, function() {
      fs.writeJsonSync(SERVICE_PATH, { serviceName: 'test' });
      expect(() => checkServiceFileExist()).to.not.throw();
      fs.removeSync(path.join(SERVICE_PATH));
    });
  });
});
