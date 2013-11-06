'use strict';

var
  events  = require('events'),
  request = require('request'),
  util    = require('util'),
  methods = [
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
  ]
;

function toCamel(str) {
  return str.replace(/(_[a-z])/g, function(substr) {
    return substr.toUpperCase().replace('_','');
  });
}

function BTSync(options) {
  events.EventEmitter.call(this);

  // Default options
  this.options = {
    host    : 'localhost',
    port    : 8888,
    username: 'api',
    password: 'secret'
  };
  // Override the default options by the user's one
  util._extend(this.options, options);

  for(var i = 0, j = methods.length; i < j; i++) {
    this[toCamel(methods[i])] = this.query.bind(this, methods[i]);
  }

  return this;
}
util.inherits(BTSync, events.EventEmitter);

BTSync.prototype.query = function(method) {
  var
    userOptions =
      typeof arguments[1] === 'object' ? arguments[1] :
      {},
    callback =
      typeof arguments[2] === 'function' ? arguments[2] :
      typeof arguments[1] === 'function' ? arguments[1] :
      null
  ;
  var options = {
    params: {
      method: method
    }
  };
  util._extend(options.params, userOptions);

  return this.rawQuery(options, callback);
};

BTSync.prototype.rawQuery = function(userOptions, callback) {
  var
    btsync = this,
    options = {
      path   : 'api',
      method : 'GET',
      params : {},
      headers: {
        Accept: 'application/json'
      }
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
        method : options.method,
        headers: options.headers,
        timeout: 30 * 1e3,
        auth   : {
          user: btsync.options.username,
          pass: btsync.options.password,
        }
      }, callback ? _apiCallback : null);
    },

    _apiCallback = function(err, res, data) {
      if (err) {
        btsync.emit('error', err);
        return callback && callback(err, data);
      }
      if (res.statusCode === 401) {
        err = new Error('Authorisation required');
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

module.exports = BTSync;
