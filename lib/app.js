'use strict';

const request = require('superagent');
const common = require('./common');
const BASE_URL = 'https://itunes.apple.com/lookup';

function app (opts) {
  return new Promise(function (resolve, reject) {
    if (!opts.id && !opts.appId) {
      throw Error('Either id or appId is required');
    }

    // TODO allow override country & language
    // TODO handle not found

    const idField = opts.id ? 'id' : 'bundleId';
    const idValue = opts.id || opts.appId;
    const url = `${BASE_URL}?${idField}=${idValue}`;

    return request
      .get(url)
      .end(function (err, res) {
        if (err || !res.ok) {
          reject(err);
          return;
        }
        resolve(JSON.parse(res.text));
      });
  })
  .then((res) => common.cleanApp(res.results[0]));
}

module.exports = app;
