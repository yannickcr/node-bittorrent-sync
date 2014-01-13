'use strict';

var
  path                 = require('path'),
  nock                 = require('nock'),
  chai                 = require('chai'),
  expect               = chai.expect,
  chaiJSONSchema       = require('chai-json-schema'),
  getSecretsSchema = require(path.join(__dirname, 'schema/getSecrets.js')),
  errorSchema          = require(path.join(__dirname, 'schema/error.js')),
  BtSync               = require('../lib/bittorrent-sync')
;

chai.use(chaiJSONSchema);

var btsync = new BtSync();

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('getSecrets', function() {

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=get_secrets')
      .replyWithFile(200, __dirname + '/mock/get_secrets-missing-parameters.json');
    done();
  });

  it('must return an error if there is some missing parameters', function(done) {
    btsync.getSecrets(function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(err.message).to.match(/Specify all the required parameters/);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=get_secrets&secret=ADB16DFRPFO7DHKOY56XQD83S55L5JBU2')
      .replyWithFile(200, __dirname + '/mock/get_secrets.json');
    done();
  });

  it('must return the secrets for the specified folder', function(done) {
    btsync.getSecrets({
      secret: 'ADB16DFRPFO7DHKOY56XQD83S55L5JBU2'
    }, function(err, result) {
      expect(err).to.equal(null);
      expect(result).to.be.jsonSchema(getSecretsSchema);
      return done();
    });
  });

  before(function(done) {
    nock('http://localhost:8888')
      .get('/api?method=get_secrets&secret=UNKNOWN')
      .replyWithFile(200, __dirname + '/mock/get_secrets-invalid-secret.json');
    done();
  });

  it('must return an error if the secret is invalid', function(done) {
    btsync.getSecrets({
      secret: 'UNKNOWN'
    }, function(err, result) {
      expect(err).to.be.instanceof(Error);
      expect(result).to.be.jsonSchema(errorSchema);
      return done();
    });
  });

  after(function(done) {
    nock.cleanAll();
    done();
  });

});
