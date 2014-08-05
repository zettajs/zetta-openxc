var net = require('net');
var EventEmitter = require('events').EventEmitter;

var OpenXC = module.exports = function(cb) {
  var client = net.connect({port: 50001}, cb);


  this.emitter = new EventEmitter();
  this.on = this.emitter.on.bind(this);
  this.emit = this.emitter.emit.bind(this);

  var self = this;
  client.on('data', function(data) {
    var d = data.toString();
    var parsed = null;

    var openIdx = d.indexOf('{', 0);
    var closeIdx = d.indexOf('}', 0);

    while(openIdx !== -1 && closeIdx !== -1) {
      var slice = d.slice(openIdx, closeIdx + 1);
      openIdx = d.indexOf('{', openIdx + 1);
      closeIdx = d.indexOf('}', closeIdx + 1);
      self.emit('data', JSON.parse(slice));
    }
  });
};

