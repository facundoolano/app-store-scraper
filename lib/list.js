'use strict';

const R = require('ramda');
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
      description: app.summary ? app.summary.label : undefined,
      developer: app['im:artist'].label,
      developerUrl,
      developerId,
      genre: app.category.attributes.label,
      genreId: app.category.attributes['im:id'],
      released: app['im:releaseDate'].label
    };
  });
}

function validate (opts) {
  if (opts.category && !R.contains(opts.category, R.values(c.category))) {
    throw Error('Invalid category ' + opts.category);
  }

  opts.collection = opts.collection || c.collection.TOP_FREE_IOS;
  if (!R.contains(opts.collection, R.values(c.collection))) {
    throw Error(`Invalid collection ${opts.collection}`);
  }

  opts.num = opts.num || 50;
  if (opts.num > 100) {
    throw Error('Cannot retrieve more than 100 apps at a time');
  }

  opts.country = opts.country || 'us';
}

function list (opts) {
  return new Promise(function (resolve, reject) {
    opts = R.clone(opts || {});
    validate(opts);

    const category = opts.category ? `/genre=${opts.category}` : '';
    const url = `https://itunes.apple.com/${opts.country}/rss/${opts.collection}/limit=${opts.num}${category}/json`;
    common.request(url)
      .then(JSON.parse)
      .then(cleanList)
      .then(resolve)
      .catch(reject);
  });
}

module.exports = common.memoize(list);
