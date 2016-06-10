'use strict';

const common = require('./common');
const BASE_URL = 'https://itunes.apple.com/search';

search.IPAD = 'iPadSoftware';
search.MAC = 'macSoftware';
search.ALL = 'software';

// TODO allow override country & language
// TODO handle not found

function search (opts) {
  return new Promise(function (resolve) {
    if (!opts.term) {
      throw Error('term is required');
    }

    const entity = opts.device || search.ALL;
    const num = opts.num || 50;
    return resolve(`${BASE_URL}?media=software&entity=${entity}&term=${opts.term}&limit=${num}`);
  })
  .then(common.request)
  .then(JSON.parse)
  .then((res) => res.results.map(common.cleanApp));
}

module.exports = common.memoize(search);
