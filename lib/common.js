'use strict';

const request = require('request');
const debug = require('debug')('app-store-scraper');
const c = require('./constants');

function cleanApp (app) {
  return {
    id: app.trackId,
    appId: app.bundleId,
    title: app.trackName,
    url: app.trackViewUrl,
    description: app.description,
    icon: app.artworkUrl512 || app.artworkUrl100 || app.artworkUrl60,
    genres: app.genres,
    genreIds: app.genreIds,
    primaryGenre: app.primaryGenreName,
    primaryGenreId: app.primaryGenreId,
    contentRating: app.contentAdvisoryRating,
    languages: app.languageCodesISO2A,
    size: app.fileSizeBytes,
    requiredOsVersion: app.minimumOsVersion,
    released: app.releaseDate,
    updated: app.currentVersionReleaseDate || app.releaseDate,
    releaseNotes: app.releaseNotes,
    version: app.version,
    price: app.price,
    currency: app.currency,
    free: app.price === 0,
    developerId: app.artistId,
    developer: app.artistName,
    developerUrl: app.artistViewUrl,
    developerWebsite: app.sellerUrl,
    score: app.averageUserRating,
    reviews: app.userRatingCount,
    currentVersionScore: app.averageUserRatingForCurrentVersion,
    currentVersionReviews: app.userRatingCountForCurrentVersion,
    screenshots: app.screenshotUrls,
    ipadScreenshots: app.ipadScreenshotUrls,
    appletvScreenshots: app.appletvScreenshotUrls,
    supportedDevices: app.supportedDevices
  };
}

// TODO add an optional parse function
const doRequest = (url, headers, requestOptions, connOptions) => new Promise(function (resolve, reject) {
  debug('Making request: %s %j %o', url, headers, requestOptions);

  requestOptions = Object.assign({ method: 'GET' }, requestOptions);

  request(Object.assign({ url, headers }, requestOptions), (error, response, body) => {
    if (error) {
      debug('Request error', error);
      return reject(error);
    }
    if (response.statusCode >= 400) {
      if ((connOptions.maxAttempts || 1) > 1) {
        debug('There was a problem but do an another attempt to download data');
        const newConnOptions = Object.assign({}, connOptions);
        newConnOptions.maxAttempts -= 1;
        return doRequest(url, headers, requestOptions, newConnOptions);
      } else {
        return reject({ response });
      }
    }
    debug('Finished request');
    resolve(body);
  });
});

const LOOKUP_URL = 'https://itunes.apple.com/lookup';

function lookup (ids, idField, country, requestOptions, connOptions) {
  idField = idField || 'id';
  country = country || 'us';
  const joinedIds = ids.join(',');
  const url = `${LOOKUP_URL}?${idField}=${joinedIds}&country=${country}&entity=software`;
  return doRequest(url, {}, requestOptions, connOptions)
    .then(JSON.parse)
    .then((res) => res.results.filter(function (app) {
      return typeof app.wrapperType === 'undefined' || app.wrapperType === 'software';
    }))
    .then((res) => res.map(cleanApp));
}

function storeId (countryCode) {
  const markets = c.markets;
  const defaultStore = '143441';
  return (countryCode && markets[countryCode.toUpperCase()]) || defaultStore;
}

function prepareConnOptions (opts) {
  return {
    maxAttempts: opts.maxAttempts || 1,
  }
}

module.exports = { cleanApp, lookup, request: doRequest, storeId, prepareConnOptions };
