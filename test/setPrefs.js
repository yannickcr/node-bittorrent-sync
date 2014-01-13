'use strict';

var
  path           = require('path'),
  nock           = require('nock'),
  chai           = require('chai'),
  expect         = chai.expect,
  chaiJSONSchema = require('chai-json-schema'),
  setPrefsSchema = require(path.join(__dirname, 'schema/getPrefs.js')),
  BtSync         = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('setPrefs', function() {

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=set_prefs')
      .replyWithFile(200, __dirname + '/mock/get_prefs.json');
    done();
  });

  it('must return the preferences for BitTorrent Sync', function(done) {
    btsync.setPrefs(function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setPrefsSchema);
      return done();
    });
  });

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=set_prefs&device_name=TheNAS')
      .replyWithFile(200, __dirname + '/mock/get_prefs.json');
    done();
  });

  it('must return the updated preferences for BitTorrent Sync', function(done) {
    btsync.setPrefs({
      device_name: 'TheNAS'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setPrefsSchema);
      return done();
    });
  });

  after(function(done) {
    nock.cleanAll();
    done();
  });

});
