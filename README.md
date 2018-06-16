# app-store-scraper [![Build Status](https://secure.travis-ci.org/facundoolano/app-store-scraper.png)](http://travis-ci.org/facundoolano/app-store-scraper)
Node.js module to scrape application data from the iTunes/Mac App Store.
The goal is to provide an interface as close as possible to the
[google-play-scraper](https://github.com/facundoolano/google-play-scraper) module.

## Installation
```
npm install app-store-scraper
```

## Usage
Available methods:
- [app](#app): Retrieves the full detail of an application.
- [list](#list): Retrieves a list of applications from one of the collections at iTunes.
- [search](#search): Retrieves a list of apps that results of searching by the given term.
- [suggest](#suggest): Given a string returns up to 50 suggestions to complete a search query term.
- [similar](#similar): Returns the list of "customers also bought" apps shown in the app's detail page.
- [reviews](#reviews): Retrieves a page of reviews for the app.

### app
Retrieves the full detail of an application. Options:

* `id`: the iTunes "trackId" of the app, for example `553834731` for Candy Crush Saga. Either this or the `appId` should be provided.
* `appId`: the iTunes "bundleId" of the app, for example `com.midasplayer.apps.candycrushsaga` for Candy Crush Saga. Either this or the `id` should be provided.
* `country`: the two letter country code to get the app details from. Defaults to `us`. Note this also affects the language of the data.

Example:

```javascript
var store = require('app-store-scraper');

store.app({id: 553834731}).then(console.log).catch(console.log);
```

Results:

```javascript
{ id: 553834731,
  appId: 'com.midasplayer.apps.candycrushsaga',
  title: 'Candy Crush Saga',
  url: 'https://itunes.apple.com/us/app/candy-crush-saga/id553834731?mt=8&uo=4',
  description: 'Candy Crush Saga, from the makers of Candy Crush ...',
  icon: 'http://is5.mzstatic.com/image/thumb/Purple30/v4/7a/e4/a9/7ae4a9a9-ff68-cbe4-eed6-fe0a246e625d/source/512x512bb.jpg',
  genres: [ 'Games', 'Entertainment', 'Puzzle', 'Arcade' ],
  genreIds: [ '6014', '6016', '7012', '7003' ],
  primaryGenre: 'Games',
  primaryGenreId: 6014,
  contentRating: '4+',
  languages: [ 'EN', 'JA' ],
  size: '73974859',
  requiredOsVersion: '5.1.1',
  released: '2012-11-14T14:41:32Z',
  updated: '2016-05-31T06:39:52Z',
  releaseNotes: 'We are back with a tasty Candy Crush Saga update ...',
  version: '1.76.1',
  price: 0,
  currency: 'USD',
  free: true,
  developerId: 526656015,
  developer: 'King',
  developerUrl: 'https://itunes.apple.com/us/developer/king/id526656015?uo=4',
  developerWebsite: undefined,
  score: 4,
  reviews: 818816,
  currentVersionScore: 4.5,
  currentVersionReviews: 1323,
  screenshots:
   [ 'http://a3.mzstatic.com/us/r30/Purple49/v4/7a/8a/a0/7a8aa0ec-976d-801f-0bd9-7b753fdaf93c/screen1136x1136.jpeg',
     ... ],
  ipadScreenshots:
   [ 'http://a1.mzstatic.com/us/r30/Purple49/v4/db/45/cf/db45cff9-bdb6-0832-157f-ac3f14565aef/screen480x480.jpeg',
     ... ],
  appletvScreenshots: [],
  supportedDevices:
   [ 'iPhone-3GS',
     'iPadWifi',
     ... ] }
```

### list

Retrieves a list of applications from one of the collections at iTunes. Options:

* `collection`: the collection to look up. Defaults to `collection.TOP_FREE_IOS`, available options can be found [here](https://github.com/facundoolano/app-store-scraper/blob/master/lib/constants.js#L3).
* `country`: the two letter country code to get the list from. Defaults to `us`.
* `num`: the amount of elements to retrieve. Defaults to `50`, maximum
  allowed is `200`.
* `fullDetail`: If this is set to `true`, an extra request will be
  made to get extra attributes of the resulting applications (like
  those returned by the `app` method).

Example:

```js
var store = require('app-store-scraper');

store.list({
  collection: store.collection.TOP_FREE_IPAD
  num: 2
})
.then(console.log)
.catch(console.log);
```

Returns:

```js
[ { id: '1091944550',
    title: 'slither.io',
    icon: 'http://is4.mzstatic.com/image/thumb/Purple30/v4/68/d7/4d/68d74df4-f4e7-d4a4-a8ea-dbab686e5554/mzl.ujmngosn.png/100x100bb-85.png',
    url: 'https://itunes.apple.com/us/app/slither.io/id1091944550?mt=8&uo=2',
    developer: 'Steve Howse',
    developerUrl: 'https://itunes.apple.com/us/developer/steve-howse/id867992583?mt=8&uo=2',
    developerId: '867992583',
    genres: ['Games'],
    genreIds: ['6014'],
    released: '2016-03-25' },
  { id: '1046846443',
    title: 'Hungry Shark World',
    icon: 'http://is5.mzstatic.com/image/thumb/Purple60/v4/08/1a/8d/081a8d06-b4d5-528b-fa8e-f53646b6f797/mzl.ehtjvlft.png/100x100bb-85.png',
    url: 'https://itunes.apple.com/us/app/hungry-shark-world/id1046846443?mt=8&uo=2',
    developer: 'Ubisoft',
    developerUrl: 'https://itunes.apple.com/us/developer/ubisoft/id317644720?mt=8&uo=2',
    developerId: '317644720',
    genres: ['Games'],
    genreIds: ['6014'],
    released: '2016-05-04' } ]
```

### search

Retrieves a list of apps that results of searching by the given term. Options:

* `term`: the term to search for (required).
* `num`: the amount of elements to retrieve. Defaults to `50`.
* `page`: page of results to retrieve. Defaults to to `1`.
* `country`: the two letter country code to get the similar apps
  from. Defaults to `us`.
* `lang`: language code for the result text. Defaults to `en-us`.
* `fullDetail`: If this is set to `true`, an extra request will be
  made to get extra attributes of the resulting applications (like
  those returned by the `app` method). Without this set to true array of ids will be returned.

Example:

```js
var store = require('app-store-scraper');

store.search({
  term: 'panda',
  num: 2,
  page: 3,
  country : 'us',
  lang: 'lang',
  fullDetail: true
})
.then(console.log)
.catch(console.log);
```

Results:

```js
[
  { id: 903990394,
    appId: 'com.pandarg.pxmobileapp',
    title: 'Panda Express Chinese Kitchen',
    (...)
  },
  {
    id: 700970012,
    appId: 'com.sgn.pandapop',
    title: 'Panda Pop',
    (...)
  }
]
```

### suggest

Given a string returns up to 50 suggestions to complete a search query term.
A priority index is also returned which goes from `0` for terms with low traffic
to `10000` for the most searched terms.

Example:

```js
var store = require('app-store-scraper');

store.suggest({term: 'panda'}).then(console.log).catch(console.log);
```

Results:

```js
[
  { term: 'panda pop', priority: '7557' },
  { term: 'panda pop free', priority: '5796' },
  { term: 'panda', priority: '5512' },
  { term: 'panda express', priority: '5174' },
  { term: 'panda games', priority: '4773' },
  { term: 'panda pop 2', priority: '4695' },
  ...
]
```

### similar
Returns the list of "customers also bought" apps shown in the app's detail page. Options:

* `id`: the iTunes "trackId" of the app, for example `553834731` for Candy Crush Saga. Either this or the `appId` should be provided.
* `appId`: the iTunes "bundleId" of the app, for example `com.midasplayer.apps.candycrushsaga` for Candy Crush Saga. Either this or the `id` should be provided.

Example:

```js
var store = require('app-store-scraper');

store.similar({id: 553834731}).then(console.log).catch(console.log);
```

Results:

```js
[
  {
    id: 632285588,
    appId: 'com.nerdyoctopus.dots',
    title: 'Dots: A Game About Connecting',
    (...)
  },
  {
    id: 727296976,
    appId: 'com.sgn.cookiejam',
    title: 'Cookie Jam',
    (...)
  }
  (...)
]
```

### reviews

Retrieves a page of reviews for the app. Options:

* `id`: the iTunes "trackId" of the app, for example `553834731` for Candy Crush Saga. Either this or the `appId` should be provided.
* `appId`: the iTunes "bundleId" of the app, for example `com.midasplayer.apps.candycrushsaga` for Candy Crush Saga. Either this or the `id` should be provided.
* `country`: the two letter country code to get the reviews from. Defaults to `us`.
* `page`: the review page number to retrieve. Defaults to `0`, maximum allowed is `9`.
* `sort`: the review sort order. Defaults to `store.sort.RECENT`, available options are `store.sort.RECENT` and `store.sort.HELPFUL`.

Example:

```js
var store = require('app-store-scraper');

store.reviews({
  appId: 'com.midasplayer.apps.candycrushsaga',
  sort: store.sort.HELPFUL,
  page: 2
})
.then(console.log)
.catch(console.log);
```

Returns:

```js
[ { id: '1472864600',
    userName: 'Linda D. Lopez',
    userUrl: 'https://itunes.apple.com/us/reviews/id324568166',
    version: '1.80.1',
    score: 5,
    title: 'Great way to pass time or unwind',
    text: 'I was a fan of Bejeweled many moons ago...',
    url: 'https://itunes.apple.com/us/review?id=553834731&type=Purple%20Software' },,
  { id: '1472864708',
    userName: 'Jennamaxkidd',
    userUrl: 'https://itunes.apple.com/us/reviews/id223990784',
    version: '1.80.1',
    score: 1,
    title: 'Help! THE PROBLEM IS NOT FIXED!',
    text: 'STILL HAVING THE SAME ISSUE.  It\'s happening again...',
    url: 'https://itunes.apple.com/us/review?id=553834731&type=Purple%20Software' },
  (...)
]
```

### Memoization

Since every library call performs one or multiple requests to
an iTunes API or web page, sometimes it can be useful to cache the results
to avoid requesting the same data twice. The `memoized` function returns the
store object that caches its results:

``` javascript
var store = require('app-store-scraper'); // regular non caching version
var memoized = require('app-store-scraper').memoized(); // cache with default options
var memoizedCustom = require('app-store-scraper').memoized({ maxAge: 1000 * 60 }); // cache with default options

memoized.app({id: 553834731}) // will make a request
  .then(() => memoized.app({id: 553834731})); // will resolve to the cached value without requesting
```

The options available are those supported by the [memoizee](https://github.com/medikoo/memoizee) module.
By default up to 1000 values are cached by each method and they expire after 5 minutes.
