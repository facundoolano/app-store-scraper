'use strict';

const app = require('./app');
const BASE_URL = 'https://itunes.apple.com/us/app/app/id';
const common = require('./common.js');

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
    .then((id) => common.request(
      `${BASE_URL}${id}`,
      {
        'X-Apple-Store-Front': `${common.storeId(opts.country)},32`
      },
      opts.requestOptions
    ))
    .then(function (text) {
      const index = text.indexOf('customersAlsoBoughtApps');
      if (index === -1) {
        return [];
      }

      const slice = text.slice(index, index + 300).match(/\[(.*)\]/)[0];
      const ids = JSON.parse(slice);
      return common.lookup(ids, 'id', opts.country, opts.requestOptions);
    });
}

module.exports = similar;
