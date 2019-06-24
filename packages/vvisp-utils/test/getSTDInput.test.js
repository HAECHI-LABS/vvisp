const chai = require('chai');
chai.use(require('chai-as-promised')).should();

const { getSTDInput } = require('../src');
const bddStdin = require('bdd-stdin');
const stdMocks = require('std-mocks');

describe('# getSTDInput test', function() {
  it('should read one line.', async function() {
    const input = 'hello';
    bddStdin(input);
    const line = await getSTDInput();
    line.should.be.equal(input);
  });

  it('should also print question', async function() {
    const input = 'hello';
    const question = 'hello?: ';
    stdMocks.use();
    bddStdin(input);
    const line = await getSTDInput(question);
    line.should.be.equal(input);
    stdMocks.restore();
    const output = stdMocks.flush();
    output.stdout[0].should.be.equal(question);
  });
});
