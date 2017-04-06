'use strict';

const app = require('./app');
const BASE_URL = 'https://itunes.apple.com/us/app/app/id';
const LOOKUP_URL = 'https://itunes.apple.com/lookup?id=';
const common = require('./common.js');
const c = require('./constants.js');

function storeId (countryCode) {
  const markets = c.markets;
  const defaultStore = '143441';
  return (countryCode && markets[countryCode.toUpperCase()]) || defaultStore;
}

function similar (opts) {
  return new Promise(function (resolve, reject) {
    if (opts.id) {
      resolve(opts.id);
    } else if (opts.appId) {
      app(opts).then((app) => resolve(app.id)).catch(reject);
    } else {
      throw Error('Either id or appId is required');
    }
  })
  .then((id) => common.request(`${BASE_URL}${id}`, {
    'X-Apple-Store-Front': `${storeId(opts.country)},32`
  }))
  .then(function (text) {
    const index = text.indexOf('customersAlsoBoughtApps');
    if (index === -1) {
      return [];
    }

    const slice = text.slice(index, index + 300).match(/\[(.*)\]/)[0];
    const ids = JSON.parse(slice);
    return common.request(LOOKUP_URL + ids.join(','))
      .then(JSON.parse)
      .then((res) => res.results.map(common.cleanApp));
  });
}

module.exports = common.memoize(similar);
