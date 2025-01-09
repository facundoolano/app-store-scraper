import app from './app.js';
import {request, lookup, storeId} from './common.js';

const BASE_URL = 'https://itunes.apple.com/us/app/app/id';
function similar (opts) {
  return new Promise(function (resolve, reject) {
    if (opts.id) {
      resolve(opts.id);
    } else if (opts.appId) {
      app(opts).then((app) => resolve(app.id)).catch(reject);
    } else {
      throw Error('Either id or appId is required');
    }
  })
    .then((id) => request(`${BASE_URL}${id}`, {
      'X-Apple-Store-Front': `${storeId(opts.country)},32`
    }, opts.requestOptions))
    .then(function (text) {
      const index = text.indexOf('customersAlsoBoughtApps');
      if (index === -1) {
        return [];
      }
      const regExp = /customersAlsoBoughtApps":(.*?\])/g;
      const match = regExp.exec(text);
      const ids = JSON.parse(match[1]);
      return lookup(ids, 'id', opts.country, opts.lang, opts.requestOptions, opts.throttle);
    });
}
export default similar;
