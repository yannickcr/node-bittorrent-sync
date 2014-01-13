'use strict';

var
  path                 = require('path'),
  nock                 = require('nock'),
  chai                 = require('chai'),
  expect               = chai.expect,
  chaiJSONSchema       = require('chai-json-schema'),
  setFilePrefsSchema = require(path.join(__dirname, 'schema/getFiles.js')),
  errorSchema          = require(path.join(__dirname, 'schema/error.js')),
  BtSync               = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('setFilePrefs', function() {

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=set_file_prefs')
      .replyWithFile(200, __dirname + '/mock/set_file_prefs-missing-parameters.json');
    done();
  });

  it('must return an error if there is some missing parameters', function(done) {
    btsync.setFilePrefs(function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(err.message).to.match(/Specify all the required parameters/);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=set_file_prefs&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .reply(200, '[{}]');
    done();
  });

  it('must return an array with an empty object if there is no specified path', function(done) {
    btsync.setFilePrefs({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setFilePrefsSchema);
      return done();
    });
  });

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=set_file_prefs&path=UNKNOWN&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .reply(200, '[]');
    done();
  });

  it('must return an array with an empty object if the specified path is unknown', function(done) {
    btsync.setFilePrefs({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2',
      path  : 'UNKNOWN',
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setFilePrefsSchema);
      return done();
    });
  });

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=set_file_prefs&path=app.js&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_files.json');
    done();
  });

  it('must return the preferences for the specified path', function(done) {
    btsync.setFilePrefs({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2',
      path  : 'app.js',
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setFilePrefsSchema);
      return done();
    });
  });

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=set_file_prefs&download=1&path=app.js&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_files.json');
    done();
  });

  it('must return the updated preferences for the specified path', function(done) {
    btsync.setFilePrefs({
      secret  : 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2',
      path    : 'app.js',
      download: 1
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setFilePrefsSchema);
      return done();
    });
  });

  after(function(done) {
    nock.cleanAll();
    done();
  });

});
