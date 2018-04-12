'use strict';

const R = require('ramda');
const common = require('./common');
const BASE_URL = 'https://itunes.apple.com/WebObjects/MZStore.woa/wa/search?clientApplication=Software&media=software&term=';

// TODO find out if there's a way to filter by device
// TODO refactor to allow memoization of the first request

function paginate (num, page) {
  num = num || 50;
  page = page - 1 || 0;
  const pageStart = num * page;
  const pageEnd = pageStart + num;
  return R.slice(pageStart, pageEnd);
}

function processResults (opts) {
  return function (results) {
    const ids = R.pluck('id', results);

    if (opts.fullDetail) {
      return common.lookup(ids, 'id', opts.country, opts.requestOptions);
    }

    return ids;
  };
}

function search (opts) {
  return new Promise(function (resolve, reject) {
    if (!opts.term) {
      throw Error('term is required');
    }
    const url = BASE_URL + encodeURIComponent(opts.term);
    const storeId = common.storeId(opts.country);
    const lang = opts.lang || 'en-us';

    common.request({
      url,
      headers: {
        'X-Apple-Store-Front': `${storeId},24 t:native`,
        'Accept-Language': lang
      },
      requestOptions: opts.requestOptions
    })
      .then(JSON.parse)
      .then((response) => (response.bubbles[0] && response.bubbles[0].results) || [])
      .then(paginate(opts.num, opts.page))
      .then(processResults(opts))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = search;
