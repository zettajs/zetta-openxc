var zetta = require('zetta');
var openxc = require('./index');

zetta()
  .use(openxc)
  .listen(3000);
