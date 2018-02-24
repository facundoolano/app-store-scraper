'use strict';

const R = require('ramda');
const common = require('./common');
const BASE_URL = 'https://itunes.apple.com/WebObjects/MZStore.woa/wa/search?clientApplication=Software&media=software&term=';

// function search (opts) {
//   return new Promise(function (resolve) {
//     if (!opts.term) {
//       throw Error('term is required');
//     }

//     const entity = opts.device || c.device.ALL;
//     const num = opts.num || 50;
//     let url = `${BASE_URL}?media=software&entity=${entity}&term=${opts.term}&limit=${num}`;
//     if (opts.country) {
//       url = url + `&country=${opts.country}`;
//     }
//     return resolve(url);
//   })
//   .then(common.request)
//   .then(JSON.parse)
//   .then((res) => res.results.map(common.cleanApp));
// }

/*
 curl -X GET \
 'https://itunes.apple.com/WebObjects/MZStore.woa/wa/search?clientApplication=Software&media=software&term=panda' \
 -H 'accept-language: en-us' \
 -H 'X-Apple-Store-Front: 143465-19,24 t:native' > resulta.txt
*/

// FIXME find out how to filter by device or remove option from README
// TODO establish a max limit for num, and allow to paginate to take more results
// TODO document country and lang in readme

function search (opts) {
  return new Promise(function (resolve) {
    if (!opts.term) {
      throw Error('term is required');
    }
    const url = BASE_URL + opts.term;
    const storeId = common.storeId(opts.country);
    const num = opts.num || 50;
    const lang = opts.lang || 'en-us';

    common.request(url, {
      'X-Apple-Store-Front': `${storeId},24 t:native`,
      'Accept-Language': lang
    })
    .then(JSON.parse)
    .then((response) => response.bubbles[0].results)
    .then(R.take(num))
    .then(R.pluck('id'))
    .then((ids) => common.lookup(ids, 'id', opts.country))
    .then(resolve);
  });
}

module.exports = search;
