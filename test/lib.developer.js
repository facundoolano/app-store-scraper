import store from '../index.js';
import { assertValidApp } from './common.js';
import { assert } from 'chai';

const FACEBOOK_ID = '284882218';
describe('Developer method', () => {
  it('should fetch a valid application list', () => {
    return store.developer({ devId: FACEBOOK_ID })
      .then((apps) => {
        apps.map(assertValidApp);
        apps.map((app) => {
          assert.equal(app.developerId, FACEBOOK_ID);
          assert.equal(app.developer, 'Meta Platforms, Inc.');
        });
      });
  });
});
