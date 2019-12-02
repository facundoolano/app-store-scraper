'use strict';

const assert = require('chai').assert;
const assertValidApp = require('./common').assertValidApp;
const assertValidUrl = require('./common').assertValidUrl;
const store = require('../index');

describe('List method', () => {
  it('should fetch a valid application list for the given category and collection', () => {
    return store.list({
      category: store.category.GAMES_ACTION,
      collection: store.collection.TOP_FREE_IOS
    })
      .then((apps) => apps.map(assertValidApp))
      .then((apps) => apps.map((app) => assert(app.free)));
  });

  it('should validate the category', () => {
    return store.list({
      category: 'wrong',
      collection: store.collection.TOP_FREE_IOS
    })
      .then(assert.fail)
      .catch((e) => assert.equal(e.message, 'Invalid category wrong'));
  });

  it('should validate the collection', () => {
    return store.list({
      category: store.category.GAMES_ACTION,
      collection: 'wrong'
    })
      .then(assert.fail)
      .catch((e) => assert.equal(e.message, 'Invalid collection wrong'));
  });

  it('should validate the results number', () => {
    return store.list({
      category: store.category.GAMES_ACTION,
      collection: store.collection.TOP_FREE_IOS,
      num: 250
    })
      .then(assert.fail)
      .catch((e) => assert.equal(e.message, 'Cannot retrieve more than 200 apps'));
  });

  it('should fetch apps with fullDetail', () => {
    return store.list({
      collection: store.collection.TOP_FREE_GAMES_IOS,
      fullDetail: true,
      num: 3
    })
      .then((apps) => apps.map(assertValidApp))
      .then((apps) => apps.map((app) => {
        assert.isString(app.description);

        // getting some entertainment apps here, skipping the check
        // assert.equal(app.primaryGenre, 'Games');
        // assert.equal(app.primaryGenreId, '6014');

        assert.equal(app.price, '0.00000');
        assert(app.free);

        assert.isString(app.developer);
        if (app.developerWebsite) {
          assertValidUrl(app.developerWebsite);
        }
      }));
  });

  it('should be able to set requestOptions', (done) => {
    store.list({
      collection: store.collection.TOP_FREE_GAMES_IOS,
      num: 5,
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
