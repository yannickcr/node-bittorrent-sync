'use strict';

var
  path                 = require('path'),
  nock                 = require('nock'),
  chai                 = require('chai'),
  expect               = chai.expect,
  chaiJSONSchema       = require('chai-json-schema'),
  setFolderHostsSchema = require(path.join(__dirname, 'schema/getFolderPrefs.js')),
  errorSchema          = require(path.join(__dirname, 'schema/error.js')),
  BtSync               = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('setFolderHosts', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=set_folder_hosts')
      .replyWithFile(200, __dirname + '/mock/set_folder_hosts-missing-parameters.json');
    done();
  });

  it('must return an error if there is some missing parameters', function(done) {
    btsync.setFolderHosts(function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(err.message).to.match(/Specify all the required parameters/);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=set_folder_hosts&hosts=192.168.0.10%3A41610&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_folder_hosts.json');
    done();
  });

  it('must return the host list for the specified folder', function(done) {
    btsync.setFolderHosts({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2',
      hosts: '192.168.0.10:41610'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setFolderHostsSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=set_folder_hosts&hosts=192.168.0.10%3A41610&secret=UNKNOWN')
      .reply(200, '{}');
    done();
  });

  it('must return an empty object if the specified folder is unknown', function(done) {
    btsync.setFolderHosts({
      secret: 'UNKNOWN',
      hosts: '192.168.0.10:41610'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(setFolderHostsSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
