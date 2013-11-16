'use strict';

var
  path            = require('path'),
  nock            = require('nock'),
  chai            = require('chai'),
  expect          = chai.expect,
  chaiJSONSchema  = require('chai-json-schema'),
  addFolderSchema = require(path.join(__dirname, 'schema/addFolder.js')),
  errorSchema     = require(path.join(__dirname, 'schema/error.js')),
  BtSync          = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('addFolder', function() {

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=add_folder')
      .replyWithFile(200, __dirname + '/mock/add_folder-missing-parameters.json');
    done();
  });

  it('must return an error if there is some missing parameters', function(done) {
    btsync.addFolder(function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(err.message).to.match(/Specify all the required parameters/);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=add_folder&dir=%2FiDoNotExist')
      .replyWithFile(200, __dirname + '/mock/add_folder-invalid-dir.json');
    done();
  });

  it('must return an error if the specified folder do not exists', function(done) {
    btsync.addFolder({
      dir: '/iDoNotExist'
    }, function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=add_folder&dir=%2Froot')
      .replyWithFile(200, __dirname + '/mock/add_folder-no-permissions.json');
    done();
  });

  it('must return an error if we do not have permissions to write to the selected folder', function(done) {
    btsync.addFolder({
      dir: '/root'
    }, function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=add_folder&secret=UNKNOWN&dir=%2FmyFiles')
      .replyWithFile(200, __dirname + '/mock/add_folder-invalid-secret.json');
    done();
  });

  it('must return an error if the specified secret is invalid', function(done) {
    btsync.addFolder({
      dir: '/myFiles',
      secret: 'UNKNOWN'
    }, function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function (done) {
    nock('http://localhost:8888')
      .get('/api?method=add_folder&dir=%2FmyFiles')
      .replyWithFile(200, __dirname + '/mock/add_folder.json');
    done();
  });

  it('must return a successful response if everything is ok', function(done) {
    btsync.addFolder({
      dir: '/myFiles'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(addFolderSchema);
      return done();
    });
  });

  after(function (done) {
    nock.cleanAll();
    done();
  });

});
