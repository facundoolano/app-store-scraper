'use strict';

const R = require('ramda');
const common = require('./common');
const app = require('./app');
const c = require('./constants');
const xmlParser = require('fast-xml-parser');

function ensureArray (value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

function getTextTypeFromContent (contents) {
  if (Array.isArray(contents)) {
    for (const content of contents) {
      if (content.attributes && content.attributes.type === 'text') {
        return content['#text'];
      }
    }
  }
  return contents;  // could not found 'text' type
}

function cleanListXml (results) {
  const reviews = ensureArray(results.feed.entry);
  return reviews.map((review) => ({
    id: review.id,
    updated: review.updated,
    userName: review.author.name,
    userUrl: review.author.uri,
    version: review['im:version'],
    score: parseInt(review['im:rating']),
    title: review.title,
    text: getTextTypeFromContent(review.content),  // can be array
    url: review.link.attributes.href
  }));
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
    opts.page = opts.page || 1;
    opts.country = opts.country || 'us';

    const url = `https://itunes.apple.com/${opts.country}/rss/customerreviews/page=${opts.page}/id=${id}/sortby=${opts.sort}/xml`;
    return common.request(url, {}, opts.requestOptions);
  })
  .then((body) => {
    return xmlParser.parse(body, {attrNodeName: 'attributes', attributeNamePrefix: '', ignoreAttributes: false});
  })
  .then(cleanListXml);

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
}

module.exports = reviews;
