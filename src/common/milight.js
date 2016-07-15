// -----------
// Wifi Bridge Interface
// ----------

function Milight(host, port) {
  this.host = host;
  this.port = port;
}

Milight.prototype.sendCommand = function(cmd) {
  chrome.sockets.udp.create({}, function(s) {

    var socketId = s.socketId;

    if (chrome.runtime.lastError) {
      console.error('CREATE:',chrome.runtime.lastError);
      return;
    }

    console.log('Created socket:',socketId);

    chrome.sockets.udp.bind(socketId, '0.0.0.0', 0, function(ret) {
      if (chrome.runtime.lastError) {
        console.error('BIND:',chrome.runtime.lastError);
        return;
      }
      console.log('Binded Socket #',socketId, ' -- ', ret);

      var buf = new ArrayBuffer(cmd.length);
      
      var bufView = new Uint8Array(buf);
      for (var i = 0; i < cmd.length; i++) {
        bufView[i] = cmd[i];
      }
     
      console.log('SEND:',buf); 

      chrome.sockets.udp.send(socketId, buf, this.host, this.port, function(sendInfo) {
        if (chrome.runtime.lastError) {
          console.error('SEND:',chrome.runtime.lastError);
        } else {
          console.log('MILIGHT:sendCommand:cmd sent:',sendInfo);
        }
        chrome.sockets.udp.close(s.socketId);
      }.bind(this));
    }.bind(this));
  }.bind(this));
}

Milight.prototype.on = function(group) {

  var cmd = 0x41;
  if (group == 1) {
    cmd = 0x45;
  } else if (group == 2) {
    cmd = 0x47;
  } else if (group == 3) {
    cmd = 0x49;
  } else if (group == 4) {
    cmd = 0x4B;
  }

  this.sendCommand([cmd, 0x00, 0x55]);
}

Milight.prototype.off = function(group) {
  var cmd = 0x42;
  if (group == 1) {
    cmd = 0x46;
  } else if (group == 2) {
    cmd = 0x48;
  } else if (group == 3) {
    cmd = 0x4A;
  } else if (group == 4) {
    cmd = 0x4C;
  }

  this.sendCommand([cmd, 0x00, 0x55]);
}

_cmdToBuffer = function(cmd) {
  var buf = new ArrayBuffer(cmd.length);
  
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < cmd.length; i++) {
    bufView[i] = cmd[i];
  }
  return buf;
}


module.exports = Milight;
