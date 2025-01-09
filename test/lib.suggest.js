import store from '../index.js';
import { assert } from 'chai';

describe('Suggest method', () => {
  it('should return five suggestion for a common term', () => store.suggest({ term: 'p' })
    .then((results) => {
      assert.equal(results.length, 10, `expected ${results} to have 10 elements`);
      results.map((r) => assert.include(r.term, 'p'));
    }));
  it('should be able to set requestOptions', (done) => {
    store.suggest({
      term: 'p',
      requestOptions: {
        method: 'DELETE'
      }
    })
      .then(() => done('should not resolve'))
      .catch((err) => {
        assert.equal(err.status, 501);
        done();
      })
      .catch(done);
  });
});
