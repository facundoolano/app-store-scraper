'use strict';

const assert = require('chai').assert;
const ratings = require('../lib/ratings');

const id = '553834731';
const appId = 'com.midasplayer.apps.candycrushsaga';

describe('Ratings method', () => {
  it('should fetch valid ratings data by id', () => {
    return ratings({id})
      .then((ratings) => {
        assert.isObject(ratings);
        assert.isNumber(ratings.ratings);
        assert.isObject(ratings.histogram);
        assert.isNumber(ratings.histogram['1']);
        assert.isNumber(ratings.histogram['2']);
        assert.isNumber(ratings.histogram['3']);
        assert.isNumber(ratings.histogram['4']);
        assert.isNumber(ratings.histogram['5']);
      });
  });

  it('should fetch valid ratings data by id and country', () => {
    let ratingsForUs, ratingsForFr;
    return ratings({id})
      .then((ratings) => {ratingsForUs = ratings;})
      .then(() => ratings({id, country: 'fr'}))
      .then((ratings) => {ratingsForFr = ratings;})
      .then(() => {
        assert.notDeepEqual(ratingsForUs, ratingsForFr);
      });
  });
});
