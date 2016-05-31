'use strict';

const request = require('superagent');
const BASE_URL = 'https://itunes.apple.com/lookup';

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

function app (opts) {
  return new Promise(function (resolve, reject) {
    if (!opts.id && !opts.appId) {
      throw Error('Either id or appId is required');
    }

    // TODO override country & language
    // TODO handle not found

    const idField = opts.id ? 'id' : 'bundleId';
    const idValue = opts.id || opts.appId;
    const url = `${BASE_URL}?${idField}=${idValue}`;

    return request
      .get(url)
      .end(function (err, res) {
        if (err || !res.ok) {
          reject(err);
          return;
        }
        resolve(JSON.parse(res.text));
      });
  })
  .then((res) => cleanApp(res.results[0]));
}

module.exports = app;
