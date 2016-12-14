'use strict';

const common = require('./common');
const BASE_URL = 'https://itunes.apple.com/search';
const c = require('./constants');

// TODO allow override country & language
// TODO handle not found

function search (opts) {
  return new Promise(function (resolve) {
    if (!opts.term) {
      throw Error('term is required');
    }

    const entity = opts.device || c.device.ALL;
    const num = opts.num || 50;
    var url = `${BASE_URL}?media=software&entity=${entity}&term=${opts.term}&limit=${num}`;
    if (opts.country) {
      url = url + `&country=${opts.country}`;
    }
    return resolve(url);
  })
  .then(common.request)
  .then(JSON.parse)
  .then((res) => res.results.map(common.cleanApp));
}

module.exports = common.memoize(search);
