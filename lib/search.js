'use strict';

const R = require('ramda');
const common = require('./common');
const BASE_URL =
  'https://itunes.apple.com/WebObjects/MZStore.woa/wa/search?clientApplication=Software&media=software&term=';

// TODO find out if there's a way to filter by device
// TODO refactor to allow memoization of the first request

function parseResponse (response, opts) {
  const appData =
    response.storePlatformData['native-search-lockup-search'] &&
    response.storePlatformData['native-search-lockup-search'].results;
  let appList = response.bubbles[0] && response.bubbles[0].results;

  if (!appData || !appList) {
    return [];
  }

  const result = [];

  const pageStart = opts.num * (opts.page - 1);
  const pageEnd = pageStart + opts.num;

  appList = appList.slice(pageStart, pageEnd);

  for (let i = 0; i < appList.length; i++) {
    const appId = appList[i].id;
    if (!appData[appId]) {
      continue;
    }
    result[i] = prepareApp(appData[appId]);
  }

  return result;
}

function prepareApp (app) {
  return {
    id: app.id,
    appId: app.bundleId,
    title: app.name,
    url: app.url,
    icon: findLargestIcon(app.artwork),
    genres: app.genreNames,
    genreIds: R.pluck('genreId', app.genres),
    primaryGenre: app.genreNames[0],
    primaryGenreId: +app.genres[0].genreId,
    contentRating: app.contentRating.name,
    size: app.offers[0].assets[0].size,
    requiredOsVersion: app.minimumOSVersion,
    released: app.releaseDate,
    version: app.offers[0].version.display,
    price: app.offers[0].price,
    free: app.offers[0].price === 0,
    developerId: app.artistId,
    developer: app.artistName,
    developerUrl: app.artistUrl,
    score: app.userRating.value,
    reviews: app.userRating.ratingCount,
    currentVersionScore: app.userRating.valueCurrentVersion,
    currentVersionReviews: app.userRating.ratingCountCurrentVersion,
    screenshots: R.pluck(
      'url',
      (app.screenshotsByType['iphone'] || [])[0] || []
    ),
    ipadScreenshots: R.pluck(
      'url',
      (app.screenshotsByType['ipad'] || [])[0] || []
    ),
    supportedDevices: app.deviceFamilies
  };
}

function findLargestIcon (artwork) {
  return artwork.sort((a, b) => a.width * a.height < b.width * b.height)[0].url;
}

function fetchAppList (response, opts) {
  const appList = response.bubbles[0] && response.bubbles[0].results;

  if (!appList) {
    return [];
  }

  const pageStart = opts.num * (opts.page - 1);
  const pageEnd = pageStart + opts.num;

  const appIds = R.pluck('id', appList).slice(pageStart, pageEnd);

  return common.lookup(appIds, 'id', opts.country, opts.requestOptions);
}

function search (opts) {
  opts = Object.assign({ num: 50, page: 1 }, opts);

  return new Promise(function (resolve, reject) {
    if (!opts.term) {
      throw Error('term is required');
    }
    const url = BASE_URL + encodeURIComponent(opts.term);
    const storeId = common.storeId(opts.country);
    const lang = opts.lang || 'en-us';

    common
      .request(
        url,
      {
        'X-Apple-Store-Front': `${storeId},24 t:native`,
        'Accept-Language': lang
      },
        opts.requestOptions
      )
      .then(JSON.parse)
      .then(response => {
        if (opts.fullDetail === false) {
          return parseResponse(response, opts);
        }
        return fetchAppList(response, opts);
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = search;
