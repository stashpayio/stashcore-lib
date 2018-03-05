'use strict';

var _ = require('lodash');
var $ = require('../../util/preconditions');
var GovObject = require('../govobject');
var errors = require('../../errors');
var inherits = require('util').inherits;

/**
 * Represents 'Trigger' Governance Object
 *
 * @constructor
 */
function Trigger(serialized) {
  GovObject.call(this, serialized);
}

inherits(Trigger, GovObject);

Trigger.prototype.dataHex = function() {

  var _govObj = {
    event_block_height: this.event_block_height,
    payment_addresses: this.payment_addresses,
    payment_amounts: this.payment_amounts,
    proposal_hashes: this.proposal_hashes,
    type: this.type,
  };
  // screwy data shims 'til we can fix this on dashd
  var inner = ['trigger', _govObj];
  var outer = [inner];

  //Done to match the rpc returns from dashd todo: follow up, if bug or not.
  var strigified = JSON
    .stringify(outer)
    .replace(/,/g,', ')
    .replace(/:/g,': ');

  return strigified
};

Trigger.prototype._newGovObject = function() {
  this.event_block_height = "";
  this.payment_addresses = "";
  this.proposal_hashes = "";
  this.payment_amounts = "";
  this.type = "";
};

Trigger.prototype.fromObject = function fromObject(arg) {
  //Allow an arg to be a stringified json
  if (!(_.isObject(arg) || arg instanceof GovObject)) {
    try {
      var parsed = JSON.parse(arg);
    } catch (e) {
      throw new Error('Must be a valid stringified JSON');
    }
    return this.fromObject(parsed);
  }

  var expectedProperties = [
    ["event_block_height", "number"],
    ["payment_addresses", "string"],
    ['payment_amounts', "string"],
    ["proposal_hashes", "string"],
    ['type', "number"]
  ];
  var trigger = arg;
  var self = this;

  _.each(expectedProperties, function(prop) {
    var expectedPropName = prop[0];
    var expectedPropType = prop[1];
    var existProp = trigger.hasOwnProperty(expectedPropName);
    if (!existProp) {
      throw new Error('Must be a valid JSON - Property ' + expectedPropName + ' missing');
    }
    var receivedType = typeof trigger[expectedPropName];
    if (receivedType !== expectedPropType) {
      var err_m = 'Must be a valid JSON - Expected property ' + expectedPropName + ' to be a ' + expectedPropType + ' received:' + receivedType
      throw new Error(err_m);
    }
    var receivedValue = trigger[expectedPropName];
    if (receivedType === "number" && isNaN(receivedValue)) {
      throw new Error('Must be a valid JSON - Expected property ' + expectedPropName + ' to be a number');
    }
    self[expectedPropName] = trigger[expectedPropName];
  });

  if (trigger.type && trigger.type !== 2) {
    //Not a trigger type, we tell about it
    throw new Error("Must be a valid trigger type.");
  }
  return this;
};

Trigger.prototype.fromBufferReader = function(reader) {
  $.checkArgument(!reader.finished(), 'No data received');

  var dataHex = reader.read(reader.buf.length);
  var object = JSON.parse(dataHex.toString('utf8'));

  if(object.constructor.name === 'Array'){
    this.type = object[0][0].type;
    this.event_block_height = object[0][1].event_block_height;
    this.payment_addresses = object[0][1].payment_addresses;
    this.payment_amounts = object[0][1].payment_amounts;
    this.proposal_hashes = object[0][1].proposal_hashes;
    this.type = object[0][1].type;
  }
  else if(object.constructor.name==='Object') _.merge(this, object)
  else throw new Error('Invalid trigger')
  return this;

};

Trigger.prototype.getSerializationError = function(opts) {
  opts = opts || {};

  // verify address
  if (!this._verifyAddress(this.payment_addresses, this.network)) {
    return new errors.GovObject.Trigger.invalidAddress();
  }

  // verify not P2SH
  if (this._verifyPayToScriptHash(this.payment_addresses, this.network)) {
    return new errors.GovObject.Trigger.invalidP2SHAddress();
  }

  // verify payment amount (should be non-negative number)
  if (this._verifyPayment(this.payment_amounts)) {
    return new errors.GovObject.Trigger.invalidPayment();
  }

};


module.exports = Trigger;
