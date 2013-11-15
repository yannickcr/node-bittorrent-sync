'use strict';

var
  path             = require('path'),
  nock             = require('nock'),
  chai             = require('chai'),
  expect           = chai.expect,
  chaiJSONSchema   = require('chai-json-schema'),
  getVersionSchema = require(path.join(__dirname, 'schema/getVersion.js')),
  BtSync           = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('getVersion', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_version')
      .replyWithFile(200, __dirname + '/mock/get_version.json');
    done();
  });

  it('must return BitTorrent Sync version', function(done) {
    btsync.getVersion(function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getVersionSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
