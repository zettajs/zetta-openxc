module.exports = function(server) {
  var vehicleQuery = server.where({type: 'vehicle'});
  var hubQuery = server.where({type: 'huehub'});

  server.observe([vehicleQuery, hubQuery], function(vehicle, hub){
    server.log('App Ready.');
    vehicle.streams.brake.on('data', function(status){
      if(status.data) {
        hub.call('color', '#ff2600');
      } else {
        hub.call('color', '#0026ff');
      }
    });
  });
};
