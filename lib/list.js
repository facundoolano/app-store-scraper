'use strict';

const R = require('ramda');
const common = require('./common');
const c = require('./constants');

function cleanApp (app) {
  const genres = app.genres.map((g) => g.name);
  const genreIds = app.genres.map((g) => g.genreId);
  // dev id missing in macos apps, parsing from url
  const developerId = parseInt(app.artistUrl.split(/id/g).pop());

  return {
    id: app.id,
    appId: app.bundleId,
    description: app.summary, // only present in mac right now
    title: app.name,
    icon: app.artworkUrl100,
    url: app.url,
    developer: app.artistName,
    developerUrl: app.artistUrl,
    developerId,
    genres,
    genreIds,
    released: app.releaseDate
  };
}

function processResults (opts) {
  return function (results) {
    const apps = results.feed.results;

    if (opts.fullDetail) {
      return common.lookup(R.pluck('id', apps), 'id', opts.country);
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

    const url = `https://rss.itunes.apple.com/api/v1/${opts.country}/${opts.collection}/${opts.num}/explicit.json`;
    common.request(url)
      .then(JSON.parse)
      .then(processResults(opts))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = list;
