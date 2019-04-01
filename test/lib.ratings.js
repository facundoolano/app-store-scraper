'use strict';

const assert = require('chai').assert;
const store = require('../index');

describe('Ratings method', () => {
  it('should fetch valid ratings data', () => {
    return store.ratings({id: '553834731'})
      .then((ratings) => {
        assert.isObject(ratings)
        assert.isNumber(ratings.ratings)
        assert.isObject(ratings.histogram)
        assert.isNumber(ratings.histogram['1'])
        assert.isNumber(ratings.histogram['2'])
        assert.isNumber(ratings.histogram['3'])
        assert.isNumber(ratings.histogram['4'])
        assert.isNumber(ratings.histogram['5'])
      });
  });
});
