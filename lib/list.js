'use strict';

const R = require('ramda');
const common = require('./common');
const c = require('./constants');

function parseLink (app) {
  if (app.link) {
    const linkArray = Array.isArray(app.link) ? app.link : [app.link];
    const link = linkArray.find(link => link.attributes.rel === 'alternate');
    return link && link.attributes.href;
  }
  return undefined;
}

function cleanApp (app) {
  let developerUrl, developerId;
  if (app['im:artist'].attributes) {
    developerUrl = app['im:artist'].attributes.href;

    if (app['im:artist'].attributes.href.includes('/id')) {
      // some non developer urls can sneak in here
      // e.g. href: 'https://itunes.apple.com/us/artist/sling-tv-llc/959665097?mt=8&uo=2'
      developerId = app['im:artist'].attributes.href.split('/id')[1].split('?mt')[0];
    }
  }

  const price = parseFloat(app['im:price'].attributes.amount);
  return {
    id: app.id.attributes['im:id'],
    appId: app.id.attributes['im:bundleId'],
    title: app['im:name'].label,
    icon: app['im:image'][app['im:image'].length - 1].label,
    url: parseLink(app),
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
}

function processResults (opts) {
  return function (results) {
    const apps = results.feed.entry;

    if (opts.fullDetail) {
      const ids = apps.map((app) => app.id.attributes['im:id']);
      return common.lookup(ids, 'id', opts.country, opts.lang, opts.requestOptions, opts.throttle);
    }

    return apps.map(cleanApp);
  };
}

function validate (opts) {
  if (opts.category && !R.includes(opts.category, R.values(c.category))) {
    throw Error('Invalid category ' + opts.category);
  }

  opts.collection = opts.collection || c.collection.TOP_FREE_IOS;
  if (!R.includes(opts.collection, R.values(c.collection))) {
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
    const storeId = common.storeId(opts.country);
    const url = `http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/${opts.collection}/${category}/limit=${opts.num}/json?s=${storeId}`;
    common.request(url, {}, opts.requestOptions)
      .then(JSON.parse)
      .then(processResults(opts))
      .then(resolve)
      .catch(reject);
  });
}

module.exports = list;
