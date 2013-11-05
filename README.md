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
	port: 8888,
	username: 'myusername',
	password: 'mypassword'
});

btsync.getFolders(function(err, data) {
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
