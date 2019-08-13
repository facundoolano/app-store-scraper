'use strict';

const common = require('./common');
const ratings = require('./ratings');

function app (opts) {
  return new Promise(function (resolve) {
    if (!opts.id && !opts.appId) {
      throw Error('Either id or appId is required');
    }
    const idField = opts.id ? 'id' : 'bundleId';
    if (typeof opts.id === 'string') opts.id = [opts.id];
    if (typeof opts.appId === 'string') opts.appId = [opts.appId];

    opts.inputData = opts.id || opts.appId;

    if (opts.inputData.length > 150) {
      throw Error('Max for bulk method is 150 entries (500)');
    }

    resolve(common.lookup(opts.inputData, idField, opts.country, opts.requestOptions));
  })
  .then((results) => {
    if (results.length === 0) {
      throw Error('App not found (404)');
    }

    let result = results[0];
    if (opts.inputData.length > 1) {
      result = results;
    }

    if (opts.ratings) {
      if (opts.inputData.length > 1) {
        // this can be dangerous
        throw Error('Ratings not implemented for bulk (501)');
      }
      if (!opts.id) {
        opts.id = result.id;
      } else {
        opts.id = opts.id[0];
      }

      return ratings(opts).then((ratingsResult) => Object.assign({}, result, ratingsResult));
    }

    return result;
  });
}

module.exports = app;
