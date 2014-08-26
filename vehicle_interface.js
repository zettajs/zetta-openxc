var SerialPort = require('serialport').SerialPort;
var EventEmitter = require('events').EventEmitter;

var OpenXCVI = module.exports = function(cb) {
  var self = this;
  this.emitter = new EventEmitter();
  this.emit = this.emitter.emit.bind(this);
  this.on = this.emitter.on.bind(this);
  this.sp = new SerialPort('/dev/tty.OpenXC-VI-0A53-SPP', {baudrate: 230400});

  var fragment = [];
  this.sp.open(function(e) {
    if(e) {
      console.log('Error:'+e);
    } else {
      self.sp.on('data', function(data) {
        var packet = data.toString().split('\0');
        var eventObj = null;
//        console.log(data.toString());
        packet.forEach(function(entry) {
          var openFound = entry.indexOf('{');
          var closedFound = entry.indexOf('}');
          if(!fragment.length) {
            if(openFound !== -1 && closedFound !== -1){
              try {
                eventObj = JSON.parse(entry);
                self.emit('data', eventObj);
              } catch (err) {
                console.error('vi parse: error', err);
                return;
              }
            } else {
              fragment.push(entry);
            }
          } else {
            if(closedFound !== -1) {
              fragment.push(entry);
              var eventStr = fragment.join('');
              try {
                eventObj = JSON.parse(eventStr);
                self.emit('data', eventObj);
              } catch(err) {
                console.error('vi parse error:', err);
              }
              fragment = [];
            } else {
              fragment.push(entry);
            }
          }
        });
      });
    }
    cb();
  });
};


