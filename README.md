Node BitTorrent Sync
====================

[![Maintenance Status][status-image]][status-url] [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][deps-image]][deps-url] [![Coverage Status][coverage-image]][coverage-url] [![Code Climate][climate-image]][climate-url]

A simple wrapper for the [BitTorrent Sync API](http://www.bittorrent.com/intl/en/sync/developers/api).

# Installation

    $ npm install bittorrent-sync

# Usage

```javascript
var BTSync = require('bittorrent-sync');

var btsync = new BTSync({
  host: 'localhost',
  port: 8888,
  username: 'myusername',
  password: 'mypassword',
  timeout: 10000
});

btsync.getFolders(function(err, data) {
  if (err) throw err;
  console.log(data);
});

btsync.addFolder({
  dir: '/btsync/data/folder1'
}, function(err, data) {
    if (err) throw err;
    console.log(data);
});
```

# Available methods

 * `getFolders`
 * `addFolder`
 * `removeFolder`
 * `getFiles`
 * `setFilePrefs`
 * `getFolderPeers`
 * `getSecrets`
 * `getFolderPrefs`
 * `setFolderPrefs`
 * `getFolderHosts`
 * `setFolderHosts`
 * `getPrefs`
 * `setPrefs`
 * `getOs`
 * `getVersion`
 * `getSpeed`
 * `shutdown`

Full API documentation can be found on the [BitTorrent Sync Website](http://www.bittorrent.com/intl/en/sync/developers/api)

# Tests

Run tests using mocha

    $ npm test

# Code Coverage

Output a code coverage report in coverage.html

    $ npm run coverage

# Code Style

Check the code style with JSCS

    $ npm run checkstyle

# License

Node BitTorrent Sync is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

[npm-url]: https://npmjs.org/package/bittorrent-sync
[npm-image]: http://img.shields.io/npm/v/bittorrent-sync.svg?style=flat

[travis-url]: https://travis-ci.org/yannickcr/node-bittorrent-sync
[travis-image]: http://img.shields.io/travis/yannickcr/node-bittorrent-sync/master.svg?style=flat

[deps-url]: https://gemnasium.com/yannickcr/node-bittorrent-sync
[deps-image]: http://img.shields.io/gemnasium/yannickcr/node-bittorrent-sync.svg?style=flat

[coverage-url]: https://coveralls.io/r/yannickcr/node-bittorrent-sync?branch=master
[coverage-image]: http://img.shields.io/coveralls/yannickcr/node-bittorrent-sync/master.svg?style=flat

[climate-url]: https://codeclimate.com/github/yannickcr/node-bittorrent-sync
[climate-image]: http://img.shields.io/codeclimate/github/yannickcr/node-bittorrent-sync.svg?style=flat

[status-url]: https://github.com/yannickcr/node-bittorrent-sync/pulse
[status-image]: http://img.shields.io/badge/status-maintained-brightgreen.svg?style=flat
