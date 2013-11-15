'use strict';

var
  path           = require('path'),
  nock           = require('nock'),
  chai           = require('chai'),
  expect         = chai.expect,
  chaiJSONSchema = require('chai-json-schema'),
  getPrefsSchema = require(path.join(__dirname, 'schema/getPrefs.js')),
  BtSync         = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('getPrefs', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_prefs')
      .replyWithFile(200, __dirname + '/mock/get_prefs.json');
    done();
  });

  it('must return BitTorrent Sync preferences', function(done) {
    btsync.getPrefs(function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getPrefsSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
