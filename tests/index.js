import 'regenerator-runtime/runtime'; // only for tests, because async/await needs it

import chai from 'chai';
import { buildOutput, createTempDir } from 'broccoli-test-helper';

import BroccoliGlow from '../';

const { expect } = chai;

chai.config.truncateThreshold = 1000;

describe('BroccoliGlow', function() {
  let input;

  beforeEach(function() {
    return createTempDir().then(tempDir => (input = tempDir));
  });

  afterEach(function() {
    return input.dispose();
  });

  it('should build', async function() {
    input.write({
      // Your fixture directory structure
    });

    let node = new BroccoliGlow(input.path(), {
      // Options
    });

    let output = await buildOutput(node);

    expect(output.read()).to.deep.equal({
      // Your transformed directory structure
    });

    output = await output.rebuild();

    expect(output.changes()).to.deep.equal({});
  });
});
