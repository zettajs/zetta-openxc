module.exports = function(server) {
  var vehicleQuery = server.where({type: 'vehicle'});

  server.observe([vehicleQuery], function(vehicle){
    server.log('Vehicle came online!');
  });
};
