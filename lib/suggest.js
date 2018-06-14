'use strict';

const common = require('./common');
const parseString = require('xml2js').parseString;

const BASE_URL = 'https://search.itunes.apple.com/WebObjects/MZSearchHints.woa/wa/hints?media=software&q=';

function parseXML (string) {
  return new Promise(function (resolve, reject) {
    return parseString(string, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
}

function extractSuggestions (xml) {
  const toJSON = (item) => ({
    term: item.string[0],
    priority: item.integer[0]
  });

  const list = xml.plist.dict[0].array[0].dict || [];
  return list.map(toJSON);
}

// TODO see language Accept-Language: en-us, en;q=0.50

function suggest (opts) {
  return new Promise(function (resolve) {
    if (!opts && !opts.term) {
      throw Error('term missing');
    }

    return resolve(BASE_URL + encodeURIComponent(opts.term));
  })
    .then(url => common.request(url, {}, opts.requestOptions))
    .then(parseXML)
    .then(extractSuggestions);
}

module.exports = suggest;
