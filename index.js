'use strict';

const c = require('./lib/constants');

module.exports.category = c.category;
module.exports.collection = c.collection;
module.exports.device = c.device;
module.exports.sort = c.sort;

module.exports.app = require('./lib/app');
module.exports.list = require('./lib/list');
module.exports.search = require('./lib/search');
module.exports.suggest = require('./lib/suggest');
module.exports.similar = require('./lib/similar');
module.exports.reviews = require('./lib/reviews');
