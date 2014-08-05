var Device = require('zetta').Device;
var util = require('util');

var OpenXC = module.exports = function(emitter) {
  Device.call(this);
  this.emitter = emitter;
  this.emitter.on('data', this.handleDataEvent);
  this.steeringWheel = 0;
};
util.inherits(OpenXC, Device);

OpenXC.prototype.init = function(config) {
  config
    .name('OpenXC')
    .type('vehicle')
    .state('running')
    .monitor('steeringWheel');
};

OpenXC.prototype.handleDataEvent = function(data) {
  if(data.name === 'steering_wheel_angle') {
    this.steeringWheel = data.value;
  }
};
