var MILIGHT_IP = '192.168.1.167';
var MILIGHT_PORT = 8899;

var Controller = require('./controller.js');
var Milight    = require('../common/milight.js');

var m = new Milight(MILIGHT_IP, MILIGHT_PORT);
var c = new Controller(m);

c.init();

