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
    let url = `${BASE_URL}?media=software&entity=${entity}&term=${opts.term}&limit=${num}`;
    if (opts.country) {
      url = url + `&country=${opts.country}`;
    }
    const options = Object.assign({
      url,
      method: 'GET',
      proxy: opts.proxy
    }, opts.requestOptions);
    return resolve(options);
  })
  .then(common.request)
  .then(JSON.parse)
  .then((res) => res.results.map(common.cleanApp));
}

module.exports = search;
