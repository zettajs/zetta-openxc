var zetta = require('zetta');
var openxc = require('./index');
var app = require('./app');
var Hue = require('zetta-hue-driver');
var Drone = require('zetta-ardrone-driver');

zetta()
  .use(openxc)
  .use(Hue)
  .use(Drone)
  .load(app)
  .listen(3000);
