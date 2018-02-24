'use strict';

const common = require('./common');

function app (opts) {
  return new Promise(function (resolve) {
    if (!opts.id && !opts.appId) {
      throw Error('Either id or appId is required');
    }
    const idField = opts.id ? 'id' : 'bundleId';
    const idValue = opts.id || opts.appId;
    resolve(common.lookup([idValue], idField, opts.country));
  })
  .then((results) => {
    if (results.length === 0) {
      throw Error('App not found (404)');
    }

    return results[0];
  });
}

module.exports = app;
