'use strict';

const assert = require('chai').assert;
const validator = require('validator');

function assertValidUrl (url) {
  return assert(validator.isURL(url, { allow_protocol_relative_urls: true }),
    `${url} is not a valid url`);
}

function assertPartialValidApp (app) {
  assert.isString(app.appId);
  assert.isString(app.title);
  assertValidUrl(app.url);
  assertValidUrl(app.icon);

  if (app.score !== undefined) {
    assert.isNumber(app.score);
  }

  assert.isBoolean(app.free);

  return app;
}

function assertValidApp (app) {
  assertPartialValidApp(app);
  assert.isString(app.description);

  if (app.score !== undefined) {
    // would fail for new apps without score
    assert.isTrue(app.score > 0, 'app has negative rating');
    assert.isTrue(app.score <= 5, 'app rating is larger than 5');
  }

  return app;
}

module.exports = { assertValidUrl, assertValidApp, assertPartialValidApp };
