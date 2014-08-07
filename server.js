var zetta = require('zetta');
var openxc = require('./index');
var app = require('./app');
var Hue = require('zetta-hue-driver');

zetta()
  .use(openxc)
  .use(Hue)
  .load(app)
  .listen(3000);
