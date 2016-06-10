'use strict';

const app = require('./app');
const common = require('./common');
const BASE_URL = 'https://itunes.apple.com/us/app/app/id';
const LOOKUP_URL = 'https://itunes.apple.com/lookup?id=';

// TODO support other storefronts for country/language
// https://github.com/gonzoua/random-stuff/blob/master/appstorereviews.rb

function similar (opts) {
  return new Promise(function (resolve) {
    if (opts.id) {
      resolve(opts.id);
    } else if (opts.appId) {
      app(opts).then((app) => resolve(app.id));
    } else {
      throw Error('Either id or appId is required');
    }
  })
  .then((id) => common.request(`${BASE_URL}${id}`, {
    'X-Apple-Store-Front': '143441,32'
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
