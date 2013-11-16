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
    password: 'secret',
    timeout : 1e4
  };
  // Override the default options by the user's one
  util._extend(this.options, options);

  // Create all API methods
  for(var i = 0, j = methods.length; i < j; i++) {
    this[toCamel(methods[i])] = this.query.bind(this, methods[i]);
  }

  return this;
}
util.inherits(BTSync, events.EventEmitter);

// Generic API query boilerplate
BTSync.prototype.query = function(method) {
  var
    userQS =
      typeof arguments[1] === 'object' ? arguments[1] :
      {},
    callback =
      typeof arguments[2] === 'function' ? arguments[2] :
      typeof arguments[1] === 'function' ? arguments[1] :
      null,
    qs = {
      method: method
    }
  ;
  util._extend(qs, userQS);

  return this._apiCall(qs, callback);
};

BTSync.prototype._apiCall = function(qs, callback) {
  var
    requestOptions = {
      url    : 'http://' + this.options.host + ':' + this.options.port + '/api',
      qs     : qs,
      method : 'GET',
      headers: {
        Accept: 'application/json'
      },
      timeout: this.options.timeout,
      auth   : {
        user: this.options.username,
        pass: this.options.password,
      }
    },
    timerStart = process.hrtime()
  ;
  this.emit('request', requestOptions);
  return request(requestOptions, callback ? this._apiCallback.bind(this, callback, timerStart) : undefined);
};

BTSync.prototype._apiCallback = function(callback, timerStart, err, res, data) {
  // Check the err object
  if (err) {
    return callback(err, data);
  }

  // Check the statusCode
  if (res.statusCode === 401) {
    err = new Error('Authorisation required');
    return callback(err);
  }

  // Parse the JSON response
  try {
    data = JSON.parse(data);
  } catch(err) {
    return callback(err, data);
  }

  // For some add_folder errors we have a "result" parameter instead of "error"
  if (typeof data.result !== 'undefined' && data.result !== 0) {
    data.error = data.result;
  }

  // Check if an error occured
  if (typeof data.error !== 'undefined' && data.error !== 0) {
    err = new Error(data.error + ': ' + data.message);
    return callback(err, data);
  }

  var time = process.hrtime(timerStart);
  this.emit('complete', {
    code: res.statusCode,
    data: data,
    time: Math.round(time[0] * 1e3 + time[1] / 1e6) // Because returning a int is too mainstream
  });

  return callback(null, data);
};

module.exports = BTSync;
