'use strict';

const common = require('./common');
const BASE_URL = 'https://itunes.apple.com/lookup';

function app (opts) {
  return new Promise(function (resolve) {
    if (!opts.id && !opts.appId) {
      throw Error('Either id or appId is required');
    }
    const idField = opts.id ? 'id' : 'bundleId';
    const idValue = opts.id || opts.appId;
    const country = opts.country || 'us';
    const options = Object.assign({
      url: `${BASE_URL}?${idField}=${idValue}&country=${country}`,
      method: 'GET',
      proxy: opts.proxy
    }, opts.requestOptions);
    return resolve(options);
  })
  .then(common.request)
  .then(JSON.parse)
  .then((res) => {
    return new Promise((resolve) => {
      if (res.results.length === 0) {
        throw Error('App not found (404)');
      }

      resolve(common.cleanApp(res.results[0]));
    });
  });
}

module.exports = app;
