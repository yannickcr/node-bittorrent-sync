'use strict';

var
  events  = require('events'),
  request = require('request'),
  util    = require('util')
;

var BTSync = function(options) {
  events.EventEmitter.call(this);

  var btsync = this;

  // Default options
  btsync.options = {
    host    : 'localhost',
    port    : 8888
  };

  // Override the default options by the user's one
  util._extend(btsync.options, options);

  btsync.methods = [
    'get_folders',
    'add_folder',
    'remove_folder',
    'get_files',
    'set_file_prefs',
    'get_folder_peers',
    'get_secrets',
    'get_folder_prefs',
    'set_folder_prefs',
    'get_folder_hosts',
    'set_folder_hosts',
    'get_prefs',
    'set_prefs',
    'get_os',
    'get_version',
    'get_speed',
    'shutdown'
  ];

  btsync._toCamel = function(str) {
    return str.replace(/(_[a-z])/g, function(substr) {
      return substr.toUpperCase().replace('_','');
    });
  };

  btsync._RawQuery = function(userOptions, callback) {
    var
      options = {
        path   : '/api',
        method : 'GET',
        params : {},
        headers: null
      },
      timerStart, time
    ;
    util._extend(options, userOptions);

    var
      // Ask the API for data
      _apiCall = function() {
        btsync.emit('request', options);

        timerStart = process.hrtime();

        return request({
          url    : 'http://' + btsync.options.host + ':' + btsync.options.port + '/' + options.path,
          qs     : options.params,
          body   : options.body,
          method : options.method,
          headers: options.headers,
          timeout: 30 * 1e3
        }, callback ? _apiCallback : null);
      },

      _apiCallback = function (err, res, data) {
        if (err) {
          btsync.emit('error', err);
          return callback && callback(err, data);
        }

        // Parse the JSON response
        try {
          data = JSON.parse(data);
        } catch(e) {
          btsync.emit('error', err);
          return callback && callback(err, data);
        }

        if (typeof data.error !== 'undefined' && data.error !== 0) {
          var error = new Error(data.error);
          btsync.emit('error', error);
          return callback && callback(error, data);
        }

        time = process.hrtime(timerStart);
        btsync.emit('complete', options, {
          code: res.statusCode,
          data: data,
          time: Math.round(time[0] * 1e3 + time[1] / 1e6) // Because returning a int is too mainstream
        });

        return callback && callback(null, data);
      }
    ;

    // Call the API
    return _apiCall();
  };

  btsync._query = function(method) {
    var
      userParams =
        typeof arguments[0] === 'object' ? arguments[0] :
        {},
      callback =
        typeof arguments[1] === 'function' ? arguments[1] :
        typeof arguments[0] === 'function' ? arguments[0] :
        null
    ;
    var params = {
      method: method
    };
    util._extend(params, userParams);

    return this.query(params, callback || null);
  };

  for(var i = 0, j = btsync.methods.length; i < j; i++) {
    btsync[btsync._toCamel(btsync.methods[i])] = btsync._query.bind(btsync, btsync.methods[i]);
  }

  return btsync;
};
util.inherits(BTSync, events.EventEmitter);

module.exports = BTSync;
