const chai = require('chai');
const assert = chai.assert;
chai.use(require('chai-as-promised')).should();
require('dotenv').config();

const path = require('path');
const fs = require('fs-extra');
const abiToScript = require('../../../scripts/abi-to-script');

const CONTRACT1 = path.join('./contracts/test/Attachment.sol');
const CONTRACT2 = path.join('./contracts/test/Token_V0.sol');

const ROOT = path.join('./contractApis');

describe('# abi-to-script process test', function() {
  this.timeout(30000);
  before(function() {
    fs.removeSync(ROOT);
  });
  // after(function() {
  //   fs.removeSync(ROOT);
  // });
  describe('# back version', function() {
    describe('# process test', function() {
      before(function() {
        this.files = [CONTRACT1, CONTRACT2];
        this.root = path.join(ROOT, 'back');
        this.abi = path.join(this.root, 'abi');
        this.js = path.join(this.root, 'js');
        this.utils = path.join(this.root, 'utils');
      });
      it('should be fulfilled', async function() {
        await abiToScript(this.files, { silent: true }).should.be.fulfilled;
      });
      it('should make all directories', function() {
        fs.lstatSync(ROOT)
          .isDirectory()
          .should.be.equal(true);
        fs.lstatSync(this.root)
          .isDirectory()
          .should.be.equal(true);
        fs.lstatSync(this.abi)
          .isDirectory()
          .should.be.equal(true);
        fs.lstatSync(this.js)
          .isDirectory()
          .should.be.equal(true);
        fs.lstatSync(this.utils)
          .isDirectory()
          .should.be.equal(true);
      });
      it('should make index files', function() {
        fs.lstatSync(path.join(this.root, 'index.js'))
          .isFile()
          .should.be.equal(true);
      });
      it('should make all abi files', function() {
        const files = fs.readdirSync(this.abi);
        files.length.should.be.equal(this.files.length);
        for (let i = 0; i < files.length; i++) {
          path.parse(files[i]).ext.should.be.equal('.json');
        }
      });
      it('should make all js files', function() {
        const files = fs.readdirSync(this.js);
        files.length.should.be.equal(this.files.length);
        for (let i = 0; i < files.length; i++) {
          path.parse(files[i]).ext.should.be.equal('.js');
        }
      });
      it('should make util files', function() {
        const files = fs.readdirSync(this.utils);
        assert.isAbove(files.length, 1);
        let hasIndex = false;
        for (let i = 0; i < files.length; i++) {
          const parses = path.parse(files[i]);
          parses.ext.should.be.equal('.js');
          if (parses.name === 'index') {
            hasIndex = true;
          }
        }
        hasIndex.should.be.equal(true);
      });
    });
    describe('# output test', function() {
      before(async function() {
        this.apis = require('../../../contractApis/back');
      });
      it('should get two constructors', function() {
        console.log(this.apis);
      });
    });
  });
  // describe('# front version', function() {
  //   describe('# process test', function() {
  //     before(function() {
  //       this.files = [CONTRACT1, CONTRACT2];
  //       this.name = 'haechi';
  //       this.root = path.join(ROOT, 'front');
  //       this.abi = path.join(this.root, 'abi');
  //       this.js = path.join(this.root, 'js');
  //     });
  //     it('should be fulfilled', async function() {
  //       await abiToScript(this.files, { silent: true, front: this.name }).should
  //         .be.fulfilled;
  //     });
  //     it('should make all directories', function() {
  //       fs.lstatSync(ROOT)
  //         .isDirectory()
  //         .should.be.equal(true);
  //       fs.lstatSync(this.root)
  //         .isDirectory()
  //         .should.be.equal(true);
  //       fs.lstatSync(this.abi)
  //         .isDirectory()
  //         .should.be.equal(true);
  //       fs.lstatSync(this.js)
  //         .isDirectory()
  //         .should.be.equal(true);
  //     });
  //     it('should make all abi files', function() {
  //       const files = fs.readdirSync(this.abi);
  //       files.length.should.be.equal(this.files.length);
  //       for (let i = 0; i < files.length; i++) {
  //         path.parse(files[i]).ext.should.be.equal('.json');
  //       }
  //     });
  //     it('should make all js files', function() {
  //       const files = fs.readdirSync(this.js);
  //       files.length.should.be.equal(this.files.length + 1); // with index file
  //       let hasIndex = false;
  //       for (let i = 0; i < files.length; i++) {
  //         const parses = path.parse(files[i]);
  //         parses.ext.should.be.equal('.js');
  //         if (parses.name === this.name) {
  //           hasIndex = true;
  //         }
  //       }
  //       hasIndex.should.be.equal(true);
  //     });
  //     it('should make rollup files', function() {
  //       fs.lstatSync(path.join(this.root, 'haechi.js'))
  //         .isFile()
  //         .should.be.equal(true);
  //       fs.lstatSync(path.join(this.root, 'haechi.es.js'))
  //         .isFile()
  //         .should.be.equal(true);
  //     });
  //   });
  // });
});
