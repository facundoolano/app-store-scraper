'use strict';

const memoizee = require('memoizee');
const debug = require('debug')('app-store-scraper');

const memoizeeDefaults = {
  primitive: true,
  normalizer: JSON.stringify,
  maxAge: 1000 * 60 * 60 * 12, // cache for 12 hours
  max: 1000 // save up to 1k results to avoid memory issues
};

function memoized (opts) {
  let module = Object.assign({}, this);
  let cacheOpts = memoizeeDefaults;

  if (typeof opts === 'object') {
    opts.primitive = true; // ensure that primitive will be always true
    cacheOpts = opts;
  }

  debug('cache configuration being used: %s', JSON.stringify(cacheOpts));

  // it shouldn't be memoized;
  delete module.memoized;

  for (let prop in module) {
    if (typeof module[prop] === 'function') {
      module[prop] = memoizee(module[prop].bind(this), cacheOpts);
    }
  }

  return module;
}

module.exports = memoized;
