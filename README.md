Node BitTorrent Sync
====================

[![NPM version](https://badge.fury.io/js/bittorrent-sync.png)](https://npmjs.org/package/bittorrent-sync) [![Build Status](https://secure.travis-ci.org/yannickcr/node-bittorrent-sync.png)](http://travis-ci.org/yannickcr/node-bittorrent-sync) [![Dependency Status](https://gemnasium.com/yannickcr/node-bittorrent-sync.png)](https://gemnasium.com/yannickcr/node-bittorrent-sync) [![Coverage Status](https://coveralls.io/repos/yannickcr/node-bittorrent-sync/badge.png?branch=master)](https://coveralls.io/r/yannickcr/node-bittorrent-sync?branch=master) [![Code Climate](https://codeclimate.com/github/yannickcr/node-bittorrent-sync.png)](https://codeclimate.com/github/yannickcr/node-bittorrent-sync)

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
  password: 'mypassword'
});

btsync.getFolders(function(err, data) {
  if (err) throw err;
  console.log(data);
});

btsync.addFolder(
  {dir: '/btsync/data/folder1'},
  function(err, data) {
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

# License

Node BitTorrent Sync is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/yannickcr/node-bittorrent-sync/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
