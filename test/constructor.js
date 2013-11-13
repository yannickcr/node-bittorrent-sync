'use strict';

var
  chai   = require('chai'),
  expect = chai.expect,
  BtSync = require('../lib/bittorrent-sync')
;

describe('constructor', function() {

  describe('without options', function() {

    var btsync = new BtSync();

    it('must create a Btsync instance', function() {
      expect(btsync).to.be.an.instanceof(BtSync);
    });

    it('must use default options', function() {
      expect(btsync.options).to.be.an('object');
      expect(btsync.options.host).to.equal('localhost');
      expect(btsync.options.port).to.equal(8888);
      expect(btsync.options.username).to.equal('api');
      expect(btsync.options.password).to.equal('secret');
    });

  });

  describe('with options', function() {

    var btsync = new BtSync({
      host    : '192.168.0.1',
      port    : 8080,
      username: 'myusername',
      password: 'mypassword'
    });

    it('must create a Btsync instance', function() {
      expect(btsync).to.be.an.instanceof(BtSync);
    });

    it('must use user options', function() {
      expect(btsync.options).to.be.an('object');
      expect(btsync.options.host).to.equal('192.168.0.1');
      expect(btsync.options.port).to.equal(8080);
      expect(btsync.options.username).to.equal('myusername');
      expect(btsync.options.password).to.equal('mypassword');
    });

  });

});
