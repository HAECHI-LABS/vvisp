const chai = require('chai');
chai.use(require('chai-as-promised')).should();

const { getAllFiles } = require('../src');
const fs = require('fs');
const path = require('path');

describe('# getAllFiles test', function() {
  it('should return all files', function() {
    const fileArr = getAllFiles(path.join(__dirname));

    Array.isArray(fileArr).should.equal(true);

    for (let filePath of fileArr) {
      fs.lstatSync(filePath)
        .isDirectory()
        .should.equal(false);
    }
  });

  it('should return just .js files', function() {
    const fileArr = getAllFiles(path.join(__dirname), filePath => {
      return path.parse(filePath).ext === '.js';
    });

    Array.isArray(fileArr).should.equal(true);

    for (let filePath of fileArr) {
      fs.lstatSync(filePath)
        .isDirectory()
        .should.equal(false);
      path.parse(filePath).ext.should.be.equal('.js');
    }
  });
});
