'use strict';

const store = require('../index');
const assertValidApp = require('./common').assertValidApp;

describe('Similar method', () => {
  it('should fetch a valid application list', () => {
    return store.similar({id: '553834731'})
    .then((apps) => apps.map(assertValidApp));
  });
});
