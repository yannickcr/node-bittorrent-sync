'use strict';

var
  path                 = require('path'),
  nock                 = require('nock'),
  chai                 = require('chai'),
  expect               = chai.expect,
  chaiJSONSchema       = require('chai-json-schema'),
  getFolderPrefsSchema = require(path.join(__dirname, 'schema/getFolderPrefs.js')),
  errorSchema          = require(path.join(__dirname, 'schema/error.js')),
  BtSync               = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('getFolderPrefs', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folder_prefs')
      .replyWithFile(200, __dirname + '/mock/get_folder_prefs-missing-parameters.json');
    done();
  });

  it('must return an error if there is some missing parameters', function(done) {
    btsync.getFolderPrefs(function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folder_prefs&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_folder_prefs.json');
    done();
  });

  it('must return the preferences for one folder', function(done) {
    btsync.getFolderPrefs({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFolderPrefsSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folder_prefs&secret=UNKNOWN')
      .reply(200, '{}');
    done();
  });

  it('must return an empty object', function(done) {
    btsync.getFolderPrefs({
      secret: 'UNKNOWN'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFolderPrefsSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
