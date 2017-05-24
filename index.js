'use strict';

const R = require('ramda');
const memoizee = require('memoizee');
const constants = require('./lib/constants');

const methods = {
  app: require('./lib/app'),
  list: require('./lib/list'),
  search: require('./lib/search'),
  suggest: require('./lib/suggest'),
  similar: require('./lib/similar'),
  reviews: require('./lib/reviews')
};

function memoized (opts) {
  const cacheOpts = Object.assign({
    primitive: true,
    normalizer: JSON.stringify,
    maxAge: 1000 * 60 * 60 * 12, // cache for 12 hours
    max: 1000 // save up to 1k results to avoid memory issues
  }, opts);
  return R.map((fn) => memoizee(fn, cacheOpts), methods);
}

module.exports = Object.assign({memoized}, constants, methods);
