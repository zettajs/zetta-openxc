var Scout = require('zetta').Scout;
var util = require('util');
var OpenXCDriver = require('./openxc_driver');
var SimIface = require('./simulator_interface');
var VehicleIface = require('./vehicle_interface');

var OpenXCScout = module.exports = function() {
  Scout.call(this);
};
util.inherits(OpenXCScout, Scout);

OpenXCScout.prototype.init = function(next) {
  var self = this;
  var sim = new SimIface(function() {
    self.discover(OpenXCDriver, sim);
  });
   
  next();
};
