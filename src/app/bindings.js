var http = require('./http.js');
var server = require('./server.js');
var Milight = require('../common/milight.js');

var PORT = 56109;

var sInstance;
var httpInstance;

var milight_ip = '192.168.1.167';
var milight_port = 8899;

function onStart() {

  sInstance = new server(PORT);
  httpInstance = new http(sInstance);
  httpInstance.start();

}

module.exports = function() {
  document.getElementById('button-start-http-server').addEventListener('click', function() {
    onStart();
  });

  document.getElementById('button-on').addEventListener('click', function() {
    var bulb = new Milight(milight_ip, milight_port);
    bulb.on(2);
  });

  document.getElementById('button-off').addEventListener('click', function() {
    var bulb = new Milight(milight_ip, milight_port);
    bulb.off(2);
  });
}
