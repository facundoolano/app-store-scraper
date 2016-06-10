'use strict';

const common = require('./common');
const BASE_URL = 'https://itunes.apple.com/lookup';

// TODO allow override country & language
// TODO handle not found

function app (opts) {
  return new Promise(function (resolve) {
    if (!opts.id && !opts.appId) {
      throw Error('Either id or appId is required');
    }
    const idField = opts.id ? 'id' : 'bundleId';
    const idValue = opts.id || opts.appId;
    return resolve(`${BASE_URL}?${idField}=${idValue}`);
  })
  .then(common.request)
  .then(JSON.parse)
  .then((res) => common.cleanApp(res.results[0]));
}

module.exports = common.memoize(app);
