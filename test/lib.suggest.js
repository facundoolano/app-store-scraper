'use strict';

const store = require('../index');
const assert = require('chai').assert;

describe('Suggest method', () => {
  it('should return five suggestion for a common term', () => store.suggest({term: 'p'})
    .then((results) => {
      assert.equal(results.length, 50, `expected ${results} to have 50 elements`);
      results.map((r) => assert.include(r.term, 'p'));
    }));

  it.only('should return five suggestion for a common term (utf8)', () => {
    return store.suggest({term: 'п', fullDetail: true})
    .then((results) => {
      assert.equal(results.length, 50, `expected ${results} to have 50 elements`);
      results.map((r) => assert.include(r.term, 'п'));
    });
  });

  it('should be able to set requestOptions', (done) => {
    store.suggest({
      term: 'p',
      requestOptions: {
        method: 'DELETE'
      }
    })
      .then(() => done('should not resolve'))
      .catch((err) => {
        assert.equal(err.response.statusCode, 501);
        done();
      })
      .catch(done);
  });
});
