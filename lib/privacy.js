'use strict';

const common = require('./common');

async function privacy (opts) {
  if (!opts.id)
    throw Error('id is required');
 
  const idValue = opts.id;
  const tokenUrl = `https://apps.apple.com/us/app/id${idValue}`;
  const html = await common.request(tokenUrl, {}, opts.requestOptions);

  const regExp = /token%22%3A%22([^%]+)%22%7D/g;
  const match = regExp.exec(html);
  const token = match[1];

  const url = `https://amp-api.apps.apple.com/v1/catalog/US/apps/${idValue}?platform=web&fields=privacyDetails&l=en-us`;
  let json = await common.request(url, {
      'Origin': 'https://apps.apple.com',
      'Authorization': `Bearer ${token}`
  }, opts.requestOptions);

  if (json.length === 0)
    throw Error('App not found (404)');

  return JSON.parse(json).data[0].attributes.privacyDetails;
}

module.exports = privacy;