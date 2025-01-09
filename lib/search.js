import * as R from 'ramda';
import {request, lookup, storeId} from './common.js';

const BASE_URL = 'https://search.itunes.apple.com/WebObjects/MZStore.woa/wa/search?clientApplication=Software&media=software&term=';
// TODO find out if there's a way to filter by device
// TODO refactor to allow memoization of the first request
function paginate (num, page) {
  num = num || 50;
  page = page - 1 || 0;
  const pageStart = num * page;
  const pageEnd = pageStart + num;
  return R.slice(pageStart, pageEnd);
}
function search (opts) {
  return new Promise(function (resolve, reject) {
    if (!opts.term) {
      throw Error('term is required');
    }
    const url = BASE_URL + encodeURIComponent(opts.term);
    const storeIdentifier = storeId(opts.country);
    const lang = opts.lang || 'en-us';
    request(url, {
      'X-Apple-Store-Front': `${storeIdentifier},24 t:native`,
      'Accept-Language': lang
    }, opts.requestOptions)
      .then(JSON.parse)
      .then((response) => (response.bubbles[0] && response.bubbles[0].results) || [])
      .then(paginate(opts.num, opts.page))
      .then(R.pluck('id'))
      .then((ids) => {
        if (!opts.idsOnly) {
          return lookup(ids, 'id', opts.country, opts.lang, opts.requestOptions, opts.throttle);
        }
        return ids;
      })
      .then(resolve)
      .catch(reject);
  });
}
export default search;
