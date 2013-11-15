'use strict';

var
  nock   = require('nock'),
  chai   = require('chai'),
  expect = chai.expect,
  BtSync = require('../lib/bittorrent-sync')
;

// Since we do not want to call any API for real we disable all real HTTP requests
nock.disableNetConnect();

describe('constructor', function() {

  describe('without options', function() {

    var btsync = new BtSync();

    it('must create a BtSync instance', function() {
      expect(btsync).to.be.an.instanceof(BtSync);
    });

    it('must use default options', function() {
      expect(btsync.options).to.be.an('object');
      expect(btsync.options.host).to.equal('localhost');
      expect(btsync.options.port).to.equal(8888);
      expect(btsync.options.username).to.equal('api');
      expect(btsync.options.password).to.equal('secret');
      expect(btsync.options.timeout).to.equal(10000);
    });

  });

  describe('with options', function() {

    var btsync = new BtSync({
      host    : '192.168.0.1',
      port    : 8080,
      username: 'myusername',
      password: 'mypassword',
      timeout : 5000
    });

    it('must create a BtSync instance', function() {
      expect(btsync).to.be.an.instanceof(BtSync);
    });

    it('must use user options', function() {
      expect(btsync.options).to.be.an('object');
      expect(btsync.options.host).to.equal('192.168.0.1');
      expect(btsync.options.port).to.equal(8080);
      expect(btsync.options.username).to.equal('myusername');
      expect(btsync.options.password).to.equal('mypassword');
      expect(btsync.options.timeout).to.equal(5000);
    });

  });

  describe('with invalid username/password', function() {

    var btsync = new BtSync({
      username: 'invalid',
      password: 'invalid'
    });

    before(function (done) {
      nock('http://localhost:8888')
        .get('/api?method=get_version')
        .reply(401);
      done();
    });

    it('must return an authorisation error', function(done) {
      btsync.getVersion(function(err, result) {
        expect(err).to.be.instanceof(Error);
        expect(result).to.equal('');
        return done();
      });
    });

  });

  describe('with invalid hostname or port', function() {

    var btsync = new BtSync({
      host   : 'invalid',
      port   : 7357,
      timeout: 1
    });

    before(function (done) {
      nock.enableNetConnect('invalid');
      done();
    });

    it('must return a timeout error', function(done) {
      btsync.getVersion(function(err, result) {
        expect(err).to.be.instanceof(Error);
        expect(result).to.equal(undefined);
        return done();
      });
    });

  });

  describe('with invalid response', function() {

    var btsync = new BtSync();

    before(function (done) {
      nock('http://localhost:8888')
        .get('/api?method=get_version')
        .reply(200, 'Hello, I\'m invalid.');
      done();
    });

    it('must return a parse error', function(done) {
      btsync.getVersion(function(err, result) {
        expect(err).to.be.instanceof(Error);
        expect(result).to.equal('Hello, I\'m invalid.');
        return done();
      });
    });

  });

});
