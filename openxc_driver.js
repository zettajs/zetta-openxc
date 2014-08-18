var Device = require('zetta').Device;
var util = require('util');

var OpenXC = module.exports = function(emitter) {
  Device.call(this);
  this._emitter = emitter;
  var self = this;
  this._emitter.on('data', function(data) {
    self.handleDataEvent(data);
  });
  this.wheel = 0;
  this.acceleration = 0;
  this.brake = false;
  this.parking = false;
  this.door = false;
};
util.inherits(OpenXC, Device);

OpenXC.prototype.init = function(config) {
  config
    .name('OpenXC')
    .type('vehicle')
    .state('running')
    .monitor('wheel')
    .monitor('acceleration')
    .monitor('parking')
    .monitor('door')
    .monitor('brake');

};

OpenXC.prototype.handleDataEvent = function(data) {
  if(data.name === 'steering_wheel_angle') {
    this.wheel = data.value;
  } else if (data.name === 'accelerator_pedal_position') {
    this.acceleration = data.value;
  } else if (data.name === 'brake_pedal_status') {
    this.brake = data.value;
  } else if (data.name === 'parking_brake_status') {
    this.parking = data.value;
  } else if (data.name === 'door_status' && data.value === 'driver') {
    this.door = data.event;
  }
};
