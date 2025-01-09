import requestLib from 'got';
import throttledRequest from 'throttled-request';
import debug from 'debug';
import c from './constants.js';

const throttled = throttledRequest(request);
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

async function doRequest (requestOptions, limit) {
  debug('Making request: %s %j %o', requestOptions);
  let req = requestLib;
  if (limit) {
    throttled.configure({
      requests: limit,
      milliseconds: 1000
    });
    req = throttled;
  }

  requestOptions = Object.assign({ method: 'GET' }, requestOptions);
  return await req(requestOptions);
}

async function request (url, headers, opts, limit) {
  const options = Object.assign({url, headers}, opts);
  debug('Making request: %j', options);
  try {
    const response = await doRequest(options, limit);
    debug('Request finished');
    return response.body;
  } catch (reason) {
    debug('Request error:', reason.message, reason.response && reason.response.statusCode);

    let message = 'Error requesting App Store:' + reason.message;
    if (reason.response && reason.response.statusCode === 404) {
      message = 'App not found (404)';
    }
    const err = Error(message);
    err.status = reason.response && reason.response.statusCode;
    throw err;
  }
}

const LOOKUP_URL = 'https://itunes.apple.com/lookup';
function lookup (ids, idField, country, lang, requestOptions, limit) {
  idField = idField || 'id';
  country = country || 'us';
  const langParam = lang ? `&lang=${lang}` : '';
  const joinedIds = ids.join(',');
  const url = `${LOOKUP_URL}?${idField}=${joinedIds}&country=${country}&entity=software${langParam}`;
  return request(url, {}, requestOptions, limit)
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
export { cleanApp };
export { lookup };
export { request };
export { storeId };
export default {
  cleanApp,
  lookup,
  request,
  storeId
};
