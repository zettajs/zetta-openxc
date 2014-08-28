var throttle = require('throttle-event');

module.exports = function(server) {
  var vehicleQuery = server.where({type: 'vehicle'});
  var brakeBulbQuery = server.where({type: 'huebulb', bulbName:'Carl'});

  server.observe([vehicleQuery, brakeBulbQuery], function(vehicle, hub){
    var oldData = null;
    vehicle.streams.brake.on('data', function(status){
      if(oldData != status.data) {
        if(status.data) {
          hub.call('color', '#ff2600');
        } else {
          hub.call('color', '#0026ff');
        }
      }
      oldData = status.data;
    });
  });

  var accelBulbQuery = server.where({type: 'huebulb', bulbName:'Matt'});

  server.observe([vehicleQuery, accelBulbQuery], function(vehicle, hub){
    var oldData = null;
    vehicle.streams.acceleration.on('data', function(status){
      if(status.data != oldData) {
        if(status.data > 0) {
          hub.call('color', '#ff2600');
        } else {
          hub.call('color', '#0026ff');
        }
      }
      oldData = status.data;
    });
  });

  var wheelBulbQuery = server.where({type: 'huebulb', bulbName:'Adam'});

  server.observe([vehicleQuery, wheelBulbQuery], function(vehicle, hub){
    var oldData = null;
    vehicle.streams.wheel.on('data', function(status){
      if(status.data != oldData) {
        if(status.data > 0) {
          hub.call('color', '#ff2600');
        } else {
          hub.call('color', '#0026ff');
        }
      }
      oldData = status.data;
    });
  });

  var droneQuery = server.where({type: 'ardrone'});

  server.observe([vehicleQuery, droneQuery], function(vehicle, drone) {
    var brake = false;
    var acceleration = false;
    vehicle.streams.brake.on('data', throttle(20, function(d) {
//      if(!acceleration) {
        if(d.data) {
          brake = true;
          drone.call('down', function(e) {
            if(e) {
              server.log(e);
            }
          });
        } else {
          brake = false;
        }
     // }
    }));

    vehicle.streams.acceleration.on('data', throttle(20,function(d) {
      //if(!brake) {
        if(d.data > 0) {
          acceleration = true;
          drone.call('take-off', function(e){
            if(e) {
              drone.call('up');
            }
          });
        } else {
          acceleration = false;
        }
      //}
    }));
    
    vehicle.streams.wheel.on('data', throttle(20, function(d) {
      if(d.data > 0) {
        drone.call('clockwise', function(e) {
          if(e) {
            server.log(e);
          }
        });
      } else if(d.data > 0) {
        drone.call('counter-clockwise', function(e) {
          if(e) {
            server.log(e);
          }
        });
      }
    }));

    vehicle.streams.highbeam.on('data', throttle(20, function(d) {
      if(d.data) {
        drone.call('land', function(e){
          if(e) {
            server.log(e);
          }
        });
      }
    }));

    var flipped = false;
    vehicle.streams.parking.on('data', throttle(20, function(d) {
      if(d.data && !flipped) {
        drone.call('flip', function(e){
          if(e) {
            server.log(e);
          } else {
            flipped = true;
          }
        });
      } else {
        flipped = false;
      }
    }));
  });



};
