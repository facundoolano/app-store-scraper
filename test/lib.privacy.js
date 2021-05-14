'use strict';

const store = require('../index');
const assert = require('chai').assert;

function assertValid (privacyType) {
  assert.isString(privacyType.privacyType);
  assert.isString(privacyType.identifier);
  assert.isString(privacyType.description);
  assert(privacyType.dataCategories);
}

describe('Privacy method', () => {
  it('should retrieve the privacy details of an app', () => {
    return store.privacy({id: '324684580'})
      .then((privacy) => {
        assert(privacy.privacyTypes);
        assert(privacy.privacyTypes.length > 0);
        privacy.privacyTypes.map(assertValid);
      });
  });
});
