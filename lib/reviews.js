'use strict';

const R = require('ramda');
const common = require('./common');
const app = require('./app');
const c = require('./constants');
const xml2js = require('xml2js').parseString;

function ensureArray (value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

function parseXml (body) {
  return new Promise((resolve, reject) => {
    xml2js(body, {
      trim: true,
      explicitArray: false
    }, (err, result) => {
      if (err)reject(err);
      else resolve(result);
    });
  });
}

function cleanJsonList (results) {
  const reviews = ensureArray(results.feed.entry);
  return reviews.map((review) => ({
    id: review.id.label,
    userName: review.author.name.label,
    userUrl: review.author.uri.label,
    version: review['im:version'].label,
    score: parseInt(review['im:rating'].label),
    title: review.title.label,
    text: review.content.label,
    url: review.link.attributes.href
  }));
}

function cleanXmlList (results) {
  const reviews = ensureArray(results.feed.entry);
  return reviews.map((review) => ({
    id: review.id,
    date: review.updated,
    userName: review.author.name,
    userUrl: review.author.uri,
    version: review['im:version'],
    score: parseInt(review['im:rating']),
    title: review.title,
    text: R.find(val => val['$'].type === 'text')(review.content)._,
    url: review.link['$'].href
  }));
}

const handlers = {
  [c.format.JSON]: {
    parse: JSON.parse,
    cleanList: cleanJsonList
  },
  [c.format.XML]: {
    parse: parseXml,
    cleanList: cleanXmlList
  }
};

const reviews = (opts) => new Promise((resolve) => {
  validate(opts);
  opts = opts || {};
  opts.sort = opts.sort || c.sort.RECENT;
  opts.page = opts.page || 1;
  opts.country = opts.country || 'us';
  opts.format = opts.format || c.format.JSON;

  if (opts.id) {
    resolve(opts.id);
  } else if (opts.appId) {
    resolve(app(opts).then(app => app.id));
  }
})
  .then((id) => {
    const url = `https://itunes.apple.com/${opts.country}/rss/customerreviews/page=${opts.page}/id=${id}/sortby=${opts.sort}/${opts.format}`;
    return common.request(url, {}, opts.requestOptions);
  })
  .then(handlers[opts.format].parse)
  .then(handlers[opts.format].cleanList);

function validate (opts) {
  if (!opts.id && !opts.appId) {
    throw Error('Either id or appId is required');
  }

  if (opts.sort && !R.contains(opts.sort, R.values(c.sort))) {
    throw new Error('Invalid sort ' + opts.sort);
  }

  if (opts.page && opts.page < 1) {
    throw new Error('Page cannot be lower than 1');
  }

  if (opts.page && opts.page > 10) {
    throw new Error('Page cannot be greater than 10');
  }

  if (opts.format && !R.contains(opts.format, R.values(c.format))) {
    throw new Error('Invalid format ' + opts.format);
  }
}

module.exports = reviews;
