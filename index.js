import * as R from 'ramda';
import memoizee from 'memoizee';
import constants from './lib/constants.js';
import app from './lib/app.js';
import list from './lib/list.js';
import search from './lib/search.js';
import developer from './lib/developer.js';
import privacy from './lib/privacy.js';
import suggest from './lib/suggest.js';
import similar from './lib/similar.js';
import reviews from './lib/reviews.js';
import ratings from './lib/ratings.js';
import versionHistory from './lib/version-history.js';

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
function memoized(opts) {
  const cacheOpts = Object.assign({
    primitive: true,
    normalizer: JSON.stringify,
    maxAge: 1000 * 60 * 5, // cache for 5 minutes
    max: 1000 // save up to 1k results to avoid memory issues
  }, opts);
  const doMemoize = (fn) => memoizee(fn, cacheOpts);
  return Object.assign({}, constants, R.map(doMemoize, methods));
}
export default Object.assign({ memoized }, constants, methods);
