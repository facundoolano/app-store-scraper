'use strict';

const common = require('./common');

function privacy (opts) {
  opts.country = opts.country || 'US';

  return new Promise((resolve) => {
    if (opts.id) {
      resolve();
    } else {
      throw Error('Either id or appId is required');
    }
  })
    .then(() => {
      const tokenUrl = `https://apps.apple.com/${opts.country}/app/id${opts.id}`;
      return common.request(tokenUrl, {}, opts.requestOptions);
    })
    .then((html) => {
      const regExp = /token%22%3A%22([^%]+)%22%7D/g;
      const match = regExp.exec(html);
      const token = match[1];

      const url = `https://amp-api.apps.apple.com/v1/catalog/${opts.country}/apps/${opts.id}?platform=web&fields=privacyDetails`;
      return common.request(url, {
        'Origin': 'https://apps.apple.com',
        'Authorization': `Bearer ${token}`
      }, opts.requestOptions);
    })
    .then((json) => {
      if (json.length === 0) { throw Error('App not found (404)'); }

      return JSON.parse(json).data[0].attributes.privacyDetails;
    });
}

module.exports = privacy;

