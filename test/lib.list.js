'use strict';

const assert = require('chai').assert;
const assertValidUrl = require('./common').assertValidUrl;
const store = require('../index');

function assertValidApp (app) {
  // list now returns less fields than the other methods
  assert.isString(app.title);
  assertValidUrl(app.url);
  assertValidUrl(app.icon);
  return app;
}

describe('List method', () => {
  it('should fetch a valid application list for the given collection', () => {
    return store.list({
      collection: store.collection.TOP_FREE_IOS
    })
    .then((apps) => apps.map(assertValidApp))
    .then((apps) => apps.map((app) => assert.isNotEmpty(app.title)));
  });

  it('should validate the collection', () => {
    return store.list({
      collection: 'wrong'
    })
    .then(assert.fail)
    .catch((e) => assert.equal(e.message, 'Invalid collection wrong'));
  });

  it('should validate the results number', () => {
    return store.list({
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
      num: 5
    })
    .then((apps) => apps.map(assertValidApp))
    .then((apps) => apps.map((app) => {
      assert.isString(app.description);

      assert.equal(app.genres[0], 'Games');
      assert.equal(app.genreIds[0], '6014');

      assert.equal(app.price, '0');
      assert(app.free);

      assert.isString(app.developer);
      if (app.developerWebsite) {
        assertValidUrl(app.developerWebsite);
      }
    }));
  });
});
