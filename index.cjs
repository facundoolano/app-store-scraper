const R = require('ramda');
const memoizee = require('memoizee');
const constants = require('./lib/constants.js');
const app = require('./lib/app.js');
const list = require('./lib/list.js');
const search = require('./lib/search.js');
const developer = require('./lib/developer.js');
const privacy = require('./lib/privacy.js');
const suggest = require('./lib/suggest.js');
const similar = require('./lib/similar.js');
const reviews = require('./lib/reviews.js');
const ratings = require('./lib/ratings.js');
const versionHistory = require('./lib/version-history.js');

const methods = {
  app,
  list,
  search,
  developer,
  privacy,
  suggest,
  similar,
  reviews,
  ratings,
  versionHistory
};
function memoized (opts) {
  const cacheOpts = Object.assign({
    primitive: true,
    normalizer: JSON.stringify,
    maxAge: 1000 * 60 * 5, // cache for 5 minutes
    max: 1000 // save up to 1k results to avoid memory issues
  }, opts);
  const doMemoize = (fn) => memoizee(fn, cacheOpts);
  return Object.assign({}, constants, R.map(doMemoize, methods));
}
module.exports = Object.assign({ memoized }, constants, methods);
