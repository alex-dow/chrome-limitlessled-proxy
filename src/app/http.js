/**
 * Very basic HTTP API
 *
 * We certainly don't need to go crazy here.
 * LimitlessLED doesn't provide a mechanism for retreiving current
 * state, so neither will we. At least, not until I need it.
 *
 * Set Color:
 * [GET|POST|PUT] /color?r=255&b=255&g=255
 *
 * Set Brightness:
 * [GET|POST|PUT] /brightness?v=[0-255]
 *
 * Turn On:
 * [GET|POST|PUT] /on
 *
 * Turn Off:
 * [GET|POST|PUT] /off
 *
 * Responses (JSON):
 *
 * { status: "ok", msg: "whatever" }
 *
 * or
 *
 * { status: "err", msg: "whatever" }
 */

var Response = function() {

}

function getJsonFromUrl() {
    var query = location.search.substr(1);
      var result = {};
        query.split("&").forEach(function(part) {
              var item = part.split("=");
                  result[item[0]] = decodeURIComponent(item[1]);
                    });
          return result;
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

function Command(cmdUrl) {

  this.url = cmdUrl;

  var cmd,query;

  if (cmdUrl.indexOf('?') > -1) {
    cmd = cmdUrl.substr(0,cmdUrl.indexOf('?'));
    query = cmdUrl.substr(cmdUrl.indexOf('?'), cmdUrl.length);
  } else {
    cmd = cmdUrl;
  }

  cmd = cmd.substr(1,cmd.length);

  this.cmd = cmd;

  this.params = {};
  if (query) {
    query.split('&').forEach(function(part) {
      var key = part.substr(0, part.indexOf('='));
      var value = part.substr(part.indexOf('='), part.length);
      this.params[key] = decodeURIComponent(value);
    }.bind(this));
  }
}

function API(server) {
  this.server = server;
  this.server.addEventListener('receive', this.parseRequest.bind(this));
}

API.prototype.sendResponse = function(statusValue, msg, socketId) {
  var json = '{ "status": "' + statusValue + '", "msg": "' + msg + '"}';

  var headers = 'HTTP/1.1 200 OK\n';
  headers += 'Access-Control-Allow-Origin: *\n';
  headers += 'Connection: close\n';
  headers += 'Content-Type: application/json\n';
  headers += 'Content-Length: ' + json.length + '\n';
  headers += '\n';

  var response = headers + json;
  console.log('RESPONSE:' + response);
  this.server.send(response, socketId);
}

API.prototype.parseRequest = function(request, socketId) {

  console.log('Request:\n', request);
  var r = request.split(' ');

  if (r[0] != 'GET' && r[0] != 'POST' && r[0] != 'PUT') {
    this.sendResponse('err', 'Invalid HTTP method', socketId);
    return;
  }

  var cmd = new Command(r[1]);

  
  this.sendResponse('ok', 'CMD: ' + cmd.cmd, socketId);
}

API.prototype.start = function() {
  this.server.start();
}

API.prototype.stop = function() {
  this.server.stop();
}

module.exports = API;

