'use strict';

var
  path             = require('path'),
  nock             = require('nock'),
  chai             = require('chai'),
  expect           = chai.expect,
  chaiJSONSchema   = require('chai-json-schema'),
  getFoldersSchema = require(path.join(__dirname, 'schema/getFolders.js')),
  BtSync           = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('getFolders', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folders')
      .replyWithFile(200, __dirname + '/mock/get_folders.json');
    done();
  });

  it('must return informations for all folders', function(done) {
    btsync.getFolders(function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFoldersSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folders&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_folders-secret.json');
    done();
  });

  it('must return informations for one folder', function(done) {
    btsync.getFolders({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFoldersSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folders&secret=UNKNOWN')
      .reply(200, '[]');
    done();
  });

  it('must return an empty list', function(done) {
    btsync.getFolders({
      secret: 'UNKNOWN'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFoldersSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
