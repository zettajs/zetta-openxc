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
};
