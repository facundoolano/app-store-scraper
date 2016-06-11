'use strict';

const common = require('./common');
const c = require('./constants');

function cleanList (results) {
  return results.feed.entry.map(function (app) {
    let developerUrl, developerId;
    if (app['im:artist'].attributes) {
      developerUrl = app['im:artist'].attributes.href;
      developerId = app['im:artist'].attributes.href.split('/id')[1].split('?mt')[0];
    }
    let price = parseFloat(app['im:price'].attributes.amount);
    return {
      id: app.id.attributes['im:id'],
      appId: app.id.attributes['im:bundleId'],
      title: app['im:name'].label,
      icon: app['im:image'][app['im:image'].length - 1].label,
      url: app.link.attributes.href,
      price,
      currency: app['im:price'].attributes.currency,
      free: price === 0,
      description: app.summary.label,
      developer: app['im:artist'].label,
      developerUrl,
      developerId,
      genre: app.category.attributes.label,
      genreId: app.category.attributes['im:id'],
      released: app['im:releaseDate'].label
    };
  });
}

function list (opts) {
  opts = opts || {};
  opts.collection = opts.collection || c.collection.TOP_FREE_IOS;
  opts.num = opts.num || 50;
  opts.country = opts.country || 'us';

  const category = opts.category ? `/genre=${opts.category}` : '';
  const url = `https://itunes.apple.com/${opts.country}/rss/${opts.collection}/limit=${opts.num}${category}/json`;
  return common.request(url)
    .then(JSON.parse)
    .then(cleanList);
}

module.exports = common.memoize(list);
