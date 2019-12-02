'use strict';

const store = require('../index');
const assertValidApp = require('./common').assertValidApp;
const assert = require('chai').assert;

describe('Search method', () => {
  it('should fetch a valid application list', () => {
    return store.search({term: 'Panda vs Zombies'})
      .then((apps) => apps.map(assertValidApp));
  });

  it('should properly paginate results', () => {
    const p1 = store.search({term: 'Panda', num: 10});
    const p2 = store.search({term: 'Panda', num: 10, page: 2});
    return Promise.all([p1, p2])
      .then(([apps1, apps2]) => {
        assert.equal(10, apps1.length);
        assert.equal(10, apps2.length);
        apps1.map(assertValidApp);
        apps2.map(assertValidApp);
        assert.notEqual(apps1[0].appId, apps2[0].appId);
      });
  });

  it('should fetch a valid application list in fr country', () => {
    return store.search({country: 'fr', term: 'Panda vs Zombies'})
      .then((apps) => {
        apps.map(assertValidApp);
        assert(apps[0]['url'].startsWith('https://apps.apple.com/fr'), 'should return french app');
      });
  });

  it('should validate the results number', function () {
    const count = 5;
    return store.search({
      term: 'vr',
      num: count
    })
      .then((apps) => {
        apps.map(assertValidApp);
        assert(apps.length === count, `should return ${count} items but ${apps.length} returned`);
      });
  });

  it('should be able to set requestOptions', (done) => {
    store.search({
      term: 'vr',
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

  it('should be able to retrieve array of application ids', (done) => {
    store.search({
      term: 'vr',
      idsOnly: true
    })
      .then(res => {
        assert.isArray(res);
        assert.isTrue(res.every(item => typeof item === 'string'));
        done();
      })
      .catch(done);
  });
});
