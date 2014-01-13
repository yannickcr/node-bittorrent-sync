'use strict';

var
  path           = require('path'),
  nock           = require('nock'),
  chai           = require('chai'),
  expect         = chai.expect,
  chaiJSONSchema = require('chai-json-schema'),
  getSpeedSchema = require(path.join(__dirname, 'schema/getSpeed.js')),
  BtSync         = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('getSpeed', function() {

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=get_speed')
      .replyWithFile(200, __dirname + '/mock/get_speed.json');
    done();
  });

  it('must return current upload and download speed', function(done) {
    btsync.getSpeed(function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getSpeedSchema);
      return done();
    });
  });

  after(function(done) {
    nock.cleanAll();
    done();
  });

});
