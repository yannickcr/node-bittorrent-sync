Node BitTorrent Sync
====================

A simple wrapper for the BitTorrent Sync API.

# Installation

    $ npm install bittorrent-sync

# Usage

```javascript
var BTSync = require('bittorrent-sync');

var btsync = new BTSync({
	host: 'localhost',
	port: 8888
});

btsync.getFolders(function(err, data) {
  if (err) throw err;
  console.log(data);
});
```

API documentation can be found on the [BitTorrent Sync Website](http://www.bittorrent.com/intl/en/sync/developers/api)

# License

Node BitTorrent Sync is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
