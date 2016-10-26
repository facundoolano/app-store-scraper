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
      num: 200
    })
    .then(assert.fail)
    .catch((e) => assert.equal(e.message, 'Cannot retrieve more than 100 apps at a time'));
  });

  it('should fetch apps with fullDetail', () => {
    return store.list({
      category: store.category.GAMES_ACTION,
      collection: store.collection.TOP_FREE_IOS,
      fullDetail: true,
      num: 5
    })
    .then((apps) => apps.map(assertValidApp))
    .then((apps) => apps.map((app) => {
      assert.isString(app.description);

      assert.equal(app.genre, 'Games');
      assert.equal(app.genreId, '6014');

      assert.equal(app.price, '0');
      assert(app.free);

      assert.isString(app.developer);
      if (app.developerWebsite) {
        assertValidUrl(app.developerWebsite);
      }
    }));
  });
});
