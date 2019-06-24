const chai = require('chai');
chai.use(require('chai-as-promised')).should();

const { getSTDInput } = require('../src');
const bddStdin = require('bdd-stdin');

describe('# getSTDInput test', function() {
  it('should read one line.', async function() {
    const input = 'hello';
    bddStdin(input);
    const line = await getSTDInput();
    line.should.be.equal(input);
  });
});
