'use strict';

const store = require('../index');
const assertValidApp = require('./common').assertValidApp;
const assert = require('chai').assert;

describe('Search method', () => {
  it('should fetch a valid application list', () => {
    return store.search({term: 'Panda vs Zombies', fullDetail: true})
    .then((apps) => apps.map(assertValidApp));
  });

  it('should properly paginate results', () => {
    const p1 = store.search({term: 'Panda', num: 10, fullDetail: true});
    const p2 = store.search({term: 'Panda', num: 10, page: 2, fullDetail: true});
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
    return store.search({country: 'fr', term: 'Panda vs Zombies', fullDetail: true})
    .then((apps) => {
      apps.map(assertValidApp);
      assert(apps[0]['url'].slice(0, 27) === 'https://itunes.apple.com/fr', 'should return french app');
    });
  });

  it('should validate the results number', function () {
    const count = 5;
    return store.search({
      term: 'vr',
      num: count,
      fullDetail: true
    })
    .then((apps) => {
      apps.map(assertValidApp);
      assert(apps.length === count, `should return ${count} items but ${apps.length} returned`);
    });
  });

  it('should return app ids if fullDetail: false', function () {
    const count = 5;
    return store.search({
      term: 'vr',
      num: count
    })
    .then((appIds) => {
      assert(appIds.length === count, `should return ${count} items but ${appIds.length} returned`);
      assert(appIds.every(id => typeof id === 'string' && !/\D/.test(id)));
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
});
