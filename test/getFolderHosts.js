'use strict';

var
  path                 = require('path'),
  nock                 = require('nock'),
  chai                 = require('chai'),
  expect               = chai.expect,
  chaiJSONSchema       = require('chai-json-schema'),
  getFolderHostsSchema = require(path.join(__dirname, 'schema/getFolderHosts.js')),
  BtSync               = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('getFolderHosts', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folder_hosts')
      .replyWithFile(200, __dirname + '/mock/get_folder_hosts-missing-parameters.json');
    done();
  });

  it('must return an error if there is some missing parameters', function(done) {
    btsync.getFolderHosts(function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(result).to.be.jsonSchema(getFolderHostsSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folder_hosts&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_folder_hosts.json');
    done();
  });

  it('must return a host list for one folder', function(done) {
    btsync.getFolderHosts({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFolderHostsSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=get_folder_hosts&secret=UNKNOWN')
      .reply(200, '{}');
    done();
  });

  it('must return an empty list', function(done) {
    btsync.getFolderHosts({
      secret: 'UNKNOWN'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getFolderHostsSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
