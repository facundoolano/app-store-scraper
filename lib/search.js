'use strict';

const request = require('superagent');
const common = require('./common');
const BASE_URL = 'https://itunes.apple.com/search';

search.IPAD = 'iPadSoftware';
search.MAC = 'macSoftware';
search.ALL = 'software'

function search (opts) {
  return new Promise(function (resolve, reject) {
    if (!opts.term) {
      throw Error('term is required');
    }

    // TODO allow override country & language
    // TODO handle not found

    const entity = opts.device || search.ALL;
    const num = opts.num || 50;
    const url = `${BASE_URL}?media=software&entity=${entity}&term=${opts.term}&limit=${num}`;

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
  .then((res) => res.results.map(common.cleanApp));
}

module.exports = search;
