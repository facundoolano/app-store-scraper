'use strict';

const R = require('ramda');
const common = require('./common');
const app = require('./app');
const c = require('./constants');

const parseString = require('xml2js').parseString;

function validate (opts) {
  if (!opts.id && !opts.appId) {
    throw Error('Either id or appId is required');
  }

  if (opts.sort && !R.contains(opts.sort, R.values(c.sort))) {
    throw new Error('Invalid sort ' + opts.sort);
  }

  if (opts.page && opts.page < 0) {
    throw new Error('Page cannot be lower than 0');
  }

  if (opts.page && opts.page > 9) {
    throw new Error('Page cannot be greater than 9');
  }
}

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

function extractReviews (xml) {
  const toJSON = (item) => {
    return {
      id: item.id[0],
      date: (new Date(item.updated[0])),
      userName: item.author[0].name[0],
      userUrl: item.author[0].uri[0],
      version: item['im:version'][0],
      score: parseInt(item['im:rating'][0]),
      title: item.title[0],
      text: item.content[0]['_'],
      url: item.link[0].$.href
    };
  };

  const list = xml.feed.entry || [];
  return list.slice(1).map(toJSON);
}

const reviews = (opts) => new Promise((resolve) => {
  validate(opts);

  if (opts.id) {
    resolve(opts.id);
  } else if (opts.appId) {
    resolve(app(opts).then(app => app.id));
  }
})
  .then((id) => {
    opts = opts || {};
    opts.sort = opts.sort || c.sort.RECENT;
    opts.page = (opts.page + 1) || 1;
    opts.country = opts.country || 'us';
    const options = Object.assign({
      url: `https://itunes.apple.com/${opts.country}/rss/customerreviews/id=${id}/sortby=${opts.sort}/page=${opts.page}/xml`,
      method: 'GET'
    }, opts.requestOptions);
    return common.request(options);
  })
  .then(parseXML)
  .then(extractReviews);

module.exports = reviews;
