'use strict';

var
  path                 = require('path'),
  nock                 = require('nock'),
  chai                 = require('chai'),
  expect               = chai.expect,
  chaiJSONSchema       = require('chai-json-schema'),
  setFolderPrefsSchema = require(path.join(__dirname, 'schema/getFolderPrefs.js')),
  errorSchema          = require(path.join(__dirname, 'schema/error.js')),
  BtSync               = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('setFolderPrefs', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=set_folder_prefs')
      .replyWithFile(200, __dirname + '/mock/set_folder_prefs-missing-parameters.json');
    done();
  });

  it('must return an error if there is some missing parameters', function(done) {
    btsync.setFolderPrefs(function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=set_folder_prefs&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_folder_prefs.json');
    done();
  });

  it('must return the preferences for one folder', function(done) {
    btsync.setFolderPrefs({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setFolderPrefsSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=set_folder_prefs&secret=UNKNOWN')
      .reply(200, '{}');
    done();
  });

  it('must return an empty object', function(done) {
    btsync.setFolderPrefs({
      secret: 'UNKNOWN'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setFolderPrefsSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get(
        '/api?method=set_folder_prefs&use_tracker=0&use_sync_trash=0&use_relay_server=0&use_hosts=0' +
        '&use_dht=1&selective_sync=1&search_lan=0&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2'
      )
      .replyWithFile(200, __dirname + '/mock/get_folder_prefs.json');
    done();
  });

  it('must return the updated preferences for one folder', function(done) {
    btsync.setFolderPrefs({
      secret          : 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2',
      search_lan      : 0,
      selective_sync  : 1,
      use_dht         : 1,
      use_hosts       : 0,
      use_relay_server: 0,
      use_sync_trash  : 0,
      use_tracker     : 0
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setFolderPrefsSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
