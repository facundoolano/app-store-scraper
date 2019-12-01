'use strict';

const assert = require('chai').assert;
const assertValidUrl = require('./common').assertValidUrl;
const store = require('../index');

describe('App method', () => {
  it('should fetch valid application data', () => {
    return store.app({id: '553834731'})
      .then((app) => {
        assert.equal(app.appId, 'com.midasplayer.apps.candycrushsaga');
        assert.equal(app.title, 'Candy Crush Saga');
        assert.equal(app.url, 'https://apps.apple.com/us/app/candy-crush-saga/id553834731?uo=4');
        assertValidUrl(app.icon);

        assert.isNumber(app.score);
        assert(app.score > 0);
        assert(app.score <= 5);

        assert.isNotOk(app.ratings);
        assert.isNotOk(app.histogram);

        assert.isNumber(app.reviews);

        assert.isString(app.description);
        assert.isString(app.updated);
        assert.equal(app.primaryGenre, 'Games');
        assert.equal(app.primaryGenreId, 6014);
        assert.isArray(app.genres);
        assert.isAtLeast(app.genres.length, 1);
        assert.isArray(app.genreIds);
        assert.isAtLeast(app.genreIds.length, 1);

        assert.isString(app.version);
        if (app.size) {
          assert.isString(app.size);
        }
        assert.isString(app.contentRating);

        assert.isString(app.requiredOsVersion);

        assert.equal(app.price, '0');
        assert(app.free === true);

        assert.equal(app.developer, 'King');
        if (app.developerWebsite) {
          assertValidUrl(app.developerWebsite);
        }

        assert(app.screenshots.length);
        app.screenshots.map(assertValidUrl);

        assert.isString(app.releaseNotes);
      });
  });

  describe('with ratings option enabled', () => {
    it('should fetch valid application data', () => {
      return store.app({id: '553834731', ratings: true})
        .then((app) => {
          assert.isNumber(app.ratings);
          assert.isObject(app.histogram);
          assert.isNumber(app.histogram['1']);
          assert.isNumber(app.histogram['2']);
          assert.isNumber(app.histogram['3']);
          assert.isNumber(app.histogram['4']);
          assert.isNumber(app.histogram['5']);
        });
    });

    it('should fetch app with bundle id', () => {
      return store.app({appId: 'com.midasplayer.apps.candycrushsaga', ratings: true})
        .then((app) => {
          assert.isNumber(app.ratings);
          assert.isObject(app.histogram);
          assert.isNumber(app.histogram['1']);
          assert.isNumber(app.histogram['2']);
          assert.isNumber(app.histogram['3']);
          assert.isNumber(app.histogram['4']);
          assert.isNumber(app.histogram['5']);
        });
    });
  });

  it('should fetch app with bundle id', () => {
    return store.app({appId: 'com.midasplayer.apps.candycrushsaga'})
      .then((app) => {
        assert.equal(app.id, '553834731');
        assert.equal(app.title, 'Candy Crush Saga');
        assert.equal(app.url, 'https://apps.apple.com/us/app/candy-crush-saga/id553834731?uo=4');
        assert.isNotOk(app.ratings);
        assert.isNotOk(app.histogram);
      });
  });

  it('should fetch app in spanish', () => {
    return store.app({id: '553834731', country: 'ar'})
      .then((app) => {
        assert.equal(app.appId, 'com.midasplayer.apps.candycrushsaga');
        assert.equal(app.title, 'Candy Crush Saga');
        assert.equal(app.url, 'https://apps.apple.com/ar/app/candy-crush-saga/id553834731?uo=4');
      });
  });

  it('should fetch app in french', () => {
    return store.app({id: '553834731', country: 'fr'})
      .then((app) => {
        assert.equal(app.appId, 'com.midasplayer.apps.candycrushsaga');
        assert.equal(app.title, 'Candy Crush Saga');
        assert.equal(app.url, 'https://apps.apple.com/fr/app/candy-crush-saga/id553834731?uo=4');
      });
  });

  it('should reject the promise for an invalid id', (done) => {
    store.app({id: '123'})
      .then(() => done('should not resolve'))
      .catch((err) => {
        assert.equal(err.message, 'App not found (404)');
        done();
      })
      .catch(done);
  });

  it('should reject the promise for an invalid appId', (done) => {
    store.app({appId: '123'})
      .then(() => done('should not resolve'))
      .catch((err) => {
        assert.equal(err.message, 'App not found (404)');
        done();
      })
      .catch(done);
  });

  it('should memoize the results when memoize enabled', () => {
    const memoized = store.memoized();
    return memoized.app({id: '553834731'})
      .then((app) => {
        assert.equal(app.appId, 'com.midasplayer.apps.candycrushsaga');
        assert.equal(app.title, 'Candy Crush Saga');
      });
  });

  it('should memoize the results with custom options', () => {
    const memoized = store.memoized({maxAge: 1000, max: 10});
    return memoized.app({id: '553834731'})
      .then((app) => {
        assert.equal(app.appId, 'com.midasplayer.apps.candycrushsaga');
        assert.equal(app.title, 'Candy Crush Saga');
      });
  });

  it('should be able to set requestOptions', (done) => {
    store.app({
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
