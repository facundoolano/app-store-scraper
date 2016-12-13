'use strict';

const store = require('../index');
const assertValidApp = require('./common').assertValidApp;
const assert = require('chai').assert;

describe('Search method', () => {
  it('should fetch a valid application list', () => {
    return store.search({term: 'Panda vs Zombies'})
    .then((apps) => apps.map(assertValidApp));
  });

  it('should fetch a valid application list in fr country', () => {
    return store.search({country: 'fr', term: 'Panda vs Zombies'})
    .then((apps) => {
      apps.map(assertValidApp);
      assert(apps[0]['url'].slice(0, 27) === 'https://itunes.apple.com/fr', 'should return french app');
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
});
