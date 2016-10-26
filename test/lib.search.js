'use strict';

const store = require('../index');
const assertValidApp = require('./common').assertValidApp;
const assert = require('chai').assert;

describe('Search method', () => {
  it('should fetch a valid application list', () => {
    return store.search({term: 'Panda vs Zombies'})
    .then((apps) => apps.map(assertValidApp));
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
