'use strict';

const request = require('request');
const memoizee = require('memoizee');
const debug = require('debug')('app-store-scraper');

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

function memoize (fn) {
  return memoizee(fn, {
    primitive: true,
    normalizer: JSON.stringify,
    maxAge: 1000 * 60 * 60 * 12 // cache for 12 hours
  });
}

module.exports = {cleanApp, request: doRequest, memoize};
