'use strict';

const common = require('./common');

function developer (opts) {
  return new Promise(function (resolve) {
    if (!opts.devId) {
      throw Error('devId is required');
    }
    resolve(common.lookup([opts.devId], 'id', opts.country, opts.lang, opts.requestOptions, opts.throttle));
  })
    .then((results) => {
    // first result is artist metadata.
    // If missing it's not a developer. If present we slice to skip it
      if (results.length === 0) {
        throw Error('Developer not found (404)');
      }

      return results;
    });
}

module.exports = developer;
