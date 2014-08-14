var SerialPort = require('serialport').SerialPort;
var EventEmitter = require('events').EventEmitter;

var OpenXCVI = module.exports = function(cb) {
  var self = this;
  this.emitter = new EventEmitter();
  this.emit = this.emitter.emit.bind(this);
  this.on = this.emitter.on.bind(this);
  this.sp = new SerialPort('/dev/tty.OpenXC-VI-F727-SPP', {baudrate: 230400});

  var cur = [];

  this.sp.open(function(e) {
    if(e) {
      console.log('Error:'+e);
    } else {
      self.sp.on('data', function(data) {
        var end = data.slice(-1);
        if(end.toString('HEX') !== '0a' || end.toString('HEX') !== '0d') {
          cur.push(data);
        } else {
          if(cur.length !== 0) {
            cur.push(data);
            var fullMessage = Buffer.concat(cur);
            self.emit('data', JSON.parse(fullMessage.slice(0, -2).toString('utf8')));
            cur = [];
          } else {
            self.emit('data', JSON.parse(data.toString()));
            cur = [];
          }
        }
      });
      cb();
    }
  });
};

