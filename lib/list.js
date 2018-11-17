'use strict';

const R = require('ramda');
const common = require('./common');
const c = require('./constants');

function cleanApp (app) {
  // dev id missing in macos apps, parsing from url
  const developerId = parseInt(app['im:artist'].attributes.href.split(/id/g).pop());

  return {
    id: app.id.attributes['im:id'],
    appId: app.id.attributes['im:bundleId'],
    description: app.summary.label, // only present in mac right now
    title: app['im:name'].label,
    icon: app['im:image'][2].label,
    url: app.id.label,
    developer: app['im:artist'].label,
    developerUrl: app['im:artist'].attributes.href,
    genre: app.category.attributes.term,
    genreId: app.category.attributes['im:id'],
    released: app['im:releaseDate'].attributes.label,
    price: app['im:price'].attributes.amount,
    developerId
  };
}

function processResults (opts) {
  return function (results) {
    const apps = results.feed.entry;

    if (opts.fullDetail) {
      return common.lookup(R.pluck('im:id', apps), 'id', opts.country, opts.requestOptions);
    }

    return apps.map(cleanApp);
  };
}

function validate (opts) {
  opts.collection = opts.collection || c.collection.TOP_FREE_IOS;
  if (!R.contains(opts.collection, R.values(c.collection))) {
    throw Error(`Invalid collection ${opts.collection}`);
  }

  opts.num = opts.num || 50;
  if (opts.num > 200) {
    throw Error('Cannot retrieve more than 200 apps');
  }

  opts.country = opts.country || 'us';
}

function list (opts) {
  return new Promise(function (resolve, reject) {
    opts = R.clone(opts || {});
    validate(opts);

    const category = opts.category ? `/genre=${opts.category}` : '';
    const url = `http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/${opts.collection}/${category}/limit=${opts.num}/json`;
    common.request(url, {}, opts.requestOptions)
      .then(JSON.parse)
      .then(processResults(opts))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = list;
