'use strict';

var
  path                 = require('path'),
  nock                 = require('nock'),
  chai                 = require('chai'),
  expect               = chai.expect,
  chaiJSONSchema       = require('chai-json-schema'),
  getFolderPeersSchema = require(path.join(__dirname, 'schema/getFolderPeers.js')),
  errorSchema          = require(path.join(__dirname, 'schema/error.js')),
  BtSync               = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('getFolderPeers', function() {

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folder_peers')
      .replyWithFile(200, __dirname + '/mock/get_folder_peers-missing-parameters.json');
    done();
  });

  it('must return an error if there is some missing parameters', function(done) {
    btsync.getFolderPeers(function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(err.message).to.match(/Specify all the required parameters/);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folder_peers&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_folder_peers.json');
    done();
  });

  it('must return the peer list for the specified folder', function(done) {
    btsync.getFolderPeers({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFolderPeersSchema);
      return done();
    });
  });

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folder_peers&secret=UNKNOWN')
      .reply(200, '[]');
    done();
  });

  it('must return an empty list if the specified folder is unknown', function(done) {
    btsync.getFolderPeers({
      secret: 'UNKNOWN'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFolderPeersSchema);
      return done();
    });
  });

  after(function(done) {
    nock.cleanAll();
    done();
  });

});
