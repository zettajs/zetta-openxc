var zetta = require('zetta');
var openxc = require('./index');
var app = require('./app');

zetta()
  .use(openxc)
  .load(app)
  .listen(3000);
