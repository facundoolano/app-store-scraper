import store from '../index.js';
import { assert } from 'chai';

function assertValid (privacyType) {
  assert.isString(privacyType.privacyType);
  assert.isString(privacyType.identifier);
  assert.isString(privacyType.description);
  assert(privacyType.dataCategories);
}
describe('Privacy method', () => {
  it('should retrieve the privacy details of an app', () => {
    return store.privacy({ id: '324684580' })
      .then((privacy) => {
        assert(privacy.privacyTypes);
        assert(privacy.privacyTypes.length > 0);
        privacy.privacyTypes.map(assertValid);
      });
  });
});
