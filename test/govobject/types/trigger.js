'use strict';

/* jshint unused: false */
/* jshint latedef: false */
var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('lodash');
var sinon = require('sinon');

var bitcore = require('../../..');
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;

var Trigger = bitcore.GovObject.Trigger;
var errors = bitcore.errors;

describe('Trigger', function() {
  it('should create new trigger', function() {
    var trigger = new Trigger();

    trigger.network = 'testnet';
    trigger.event_block_height = 80760;
    trigger.payment_addresses = 'yik5HAgVAgjH1oZKjcDfvcf22bwBNbSYzB';
    trigger.payment_amounts = '10.00000000';
    trigger.proposal_hashes = '20e69b35c1517c5d73aa41b1d34b59abbf36b330baf775f61282d2316bfd86eb';
    trigger.type =2;
    trigger.serialize().should.equal(expectedHex);
  });
  it('should parse a serialised datahex trigger', function(){

    var datahex1 = '5b5b2274726967676572222c207b226576656e745f626c6f636b5f686569676874223a2038303736302c20227061796d656e745f616464726573736573223a202279696b354841675641676a48316f5a4b6a63446676636632326277424e6253597a42222c20227061796d656e745f616d6f756e7473223a202231302e3030303030303030222c202270726f706f73616c5f686173686573223a202232306536396233356331353137633564373361613431623164333462353961626266333662333330626166373735663631323832643233313662666438366562222c202274797065223a20327d5d5d'

    var trigger1 = new Trigger(datahex1);
    expect(trigger1.toString()).to.equal(datahex1);
    expect(trigger1.type).to.equal(2);
    expect(trigger1.event_block_height).to.equal(80760);
    expect(trigger1.payment_addresses).to.equal('yik5HAgVAgjH1oZKjcDfvcf22bwBNbSYzB');
    expect(trigger1.payment_amounts).to.equal('10.00000000');
    expect(trigger1.proposal_hashes).to.equal('20e69b35c1517c5d73aa41b1d34b59abbf36b330baf775f61282d2316bfd86eb');

  })

});
var expectedHex = '5b5b2274726967676572222c207b226576656e745f626c6f636b5f686569676874223a2038303736302c20227061796d656e745f616464726573736573223a202279696b354841675641676a48316f5a4b6a63446676636632326277424e6253597a42222c20227061796d656e745f616d6f756e7473223a202231302e3030303030303030222c202270726f706f73616c5f686173686573223a202232306536396233356331353137633564373361613431623164333462353961626266333662333330626166373735663631323832643233313662666438366562222c202274797065223a20327d5d5d';
