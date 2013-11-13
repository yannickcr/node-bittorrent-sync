'use strict';

var
  path           = require('path'),
  nock           = require('nock'),
  chai           = require('chai'),
  expect         = chai.expect,
  assert         = chai.assert,
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

  it('must get OS informations', function(done) {
    btsync.getOs(function(err, result) {
      if (err) {
        assert.fail(err, null);
        return done();
      }

      expect(result).to.be.jsonSchema(getOsSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
