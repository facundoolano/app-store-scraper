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
const doRequest = (url, headers) => new Promise(function (resolve, reject) {
  debug('Making request: %s %j', url, headers);

  request.get({url, headers}, (error, response, body) => {
    if (error) {
      debug('Request error', error);
      return reject(error);
    }
    if (response.statusCode >= 400) {
      return reject({response});
    }
    debug('Finished request');
    resolve(body);
  });
});

const LOOKUP_URL = 'https://itunes.apple.com/lookup';

function lookup (ids, idField, country) {
  idField = idField || 'id';
  country = country || 'us';
  const joinedIds = ids.join(',');
  const url = `${LOOKUP_URL}?${idField}=${joinedIds}&country=${country}`;
  return doRequest(url)
    .then(JSON.parse)
    .then((res) => res.results.map(cleanApp));
}

function storeId (countryCode) {
  const markets = c.markets;
  const defaultStore = '143441';
  return (countryCode && markets[countryCode.toUpperCase()]) || defaultStore;
}

module.exports = {cleanApp, lookup, request: doRequest, storeId};
