'use strict';

const R = require('ramda');
const memoizee = require('memoizee');
const scraper = require('..');
const debug = require('debug')('app-store-scraper');

const memoizeeDefaults = {
  primitive: true,
  normalizer: JSON.stringify,
  maxAge: 1000 * 60 * 60 * 12, // cache for 12 hours
  max: 1000 // save up to 1k results to avoid memory issues
};

function memoized (opts) {
  let cacheOpts = memoizeeDefaults;

  const memoizeMethods = (val) => {
    if (typeof val === 'function') {
      return memoizee(val, cacheOpts);
    }
    return val;
  };

  if (typeof opts === 'object') {
    opts.primitive = true; // ensure that primitive will be always true
    cacheOpts = opts;
  }

  debug('cache configuration being used: %s', JSON.stringify(cacheOpts));

  return R.mapObjIndexed(memoizeMethods, scraper);
}

module.exports = memoized;
