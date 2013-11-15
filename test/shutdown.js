'use strict';

var
  path           = require('path'),
  nock           = require('nock'),
  chai           = require('chai'),
  expect         = chai.expect,
  chaiJSONSchema = require('chai-json-schema'),
  shutdownSchema    = require(path.join(__dirname, 'schema/shutdown.js')),
  BtSync         = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('shutdown', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=shutdown')
      .replyWithFile(200, __dirname + '/mock/shutdown.json');
    done();
  });

  it('must stop BitTorrent Sync', function(done) {
    btsync.shutdown(function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(shutdownSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
