'use strict';

const store = require('../index');
const assertValidApp = require('./common').assertValidApp;
const assert = require('chai').assert;

describe('Similar method', () => {
  it('should fetch a valid application list', () => {
    return store.similar({id: '553834731'})
      .then((apps) => apps.map(assertValidApp));
  });

  it('should a different list in fr country', () => {
    return store.similar({id: '553834731'})
      .then((usApps) => {
        return store.similar({id: '553834731', country: 'fr'}).then(function (frApps) {
          return {
            fr: frApps,
            us: usApps
          };
        });
      })
      .then((langApps) => {
        langApps.fr.map(assertValidApp);
        let areDifferent = false;
        for (let i = 0; i < langApps.fr.length; i++) {
          if (langApps.us[i] && langApps.fr[i] && langApps.us[i].id !== langApps.fr[i].id) {
            areDifferent = true;
          }
        }
        assert(areDifferent, '2 similar list from different languages must be differents');
      });
  });

  it('should be able to set requestOptions', (done) => {
    store.similar({
      id: '553834731',
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
