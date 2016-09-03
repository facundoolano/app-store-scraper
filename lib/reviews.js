'use strict';

const common = require('./common');
const app = require('./app');
const c = require('./constants');

const cleanList = (results) =>
  results.feed.entry.slice(1).map((review) => ({
    userName: review.author.name.label,
    userUrl: review.author.uri.label,
    version: review['im:version'].label,
    score: parseInt(review['im:rating'].label),
    title: review.title.label,
    text: review.content.label,
    url: review.link.attributes.href
  }));

const reviews = (opts) => new Promise((resolve) => {
  if (opts.id) {
    resolve(opts.id);
  } else if (opts.appId) {
    app(opts).then((app) => resolve(app.id));
  } else {
    throw Error('Either id or appId is required');
  }
})
.then((id) => {
  opts = opts || {};
  opts.sort = opts.sort || c.sort.RECENT;
  opts.page = opts.page || 1;
  opts.country = opts.country || 'us';

  const url = `https://itunes.apple.com/${opts.country}/rss/customerreviews/page=${opts.page}/id=${id}/sortby=${opts.sort}/json`;
  return common.request(url);
})
.then(JSON.parse)
.then(cleanList);

module.exports = common.memoize(reviews);
