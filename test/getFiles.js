'use strict';

var
  path           = require('path'),
  nock           = require('nock'),
  chai           = require('chai'),
  expect         = chai.expect,
  chaiJSONSchema = require('chai-json-schema'),
  getFilesSchema = require(path.join(__dirname, 'schema/getFiles.js')),
  errorSchema    = require(path.join(__dirname, 'schema/error.js')),
  BtSync         = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('getFiles', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_files')
      .replyWithFile(200, __dirname + '/mock/get_files-missing-parameters.json');
    done();
  });

  it('must return an error if there is some missing parameters', function(done) {
    btsync.getFiles(function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_files&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_files.json');
    done();
  });

  it('must return a files list', function(done) {
    btsync.getFiles({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFilesSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_files&secret=UNKNOWN')
      .reply(200, '[]');
    done();
  });

  it('must return an empty list for an unknown folder', function(done) {
    btsync.getFiles({
      secret: 'UNKNOWN'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFilesSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_files&path=node_modules&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_files.json');
    done();
  });

  it('must return a files list for the specified path', function(done) {
    btsync.getFiles({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2',
      path  : 'node_modules'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFilesSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_files&path=UNKNOWN&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .reply(200, '[]');
    done();
  });

  it('must return an empty list for an unknown path', function(done) {
    btsync.getFiles({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2',
      path  : 'UNKNOWN'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFilesSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
