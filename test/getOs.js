'use strict';

var
  path           = require('path'),
  nock           = require('nock'),
  chai           = require('chai'),
  expect         = chai.expect,
  chaiJSONSchema = require('chai-json-schema'),
  getOsSchema    = require(path.join(__dirname, 'schema/getOs.js')),
  BtSync         = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('getOs', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_os')
      .replyWithFile(200, __dirname + '/mock/get_os.json');
    done();
  });

  it('must return the OS informations', function(done) {
    btsync.getOs(function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getOsSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
