// ---------------
// Socket Server
// ---------------

var tcpServer = chrome.sockets.tcpServer;
var tcpSocket = chrome.sockets.tcp;

/**
 * Convert raw buffer into string
 */
function bufferToString(buffer) {
  var str = '';

  var intArray = new Uint8Array(buffer);
  for (var s = 0; s < intArray.length; s++) {
    str += String.fromCharCode(intArray[s]);
  }
  return str;
}

/**
 * Convert string to raw buffer
 */
function stringToBuffer(str, callback) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function acceptCallbackWrapper(acceptInfo) {
  tcpSocket.setPaused(acceptInfo.clientSocketId, false);
  if (acceptInfo.socketId != serverSocketId) {
    return;
  }
  console.log('ACCEPT:',acceptInfo);
}


var acceptCallbacks;
var receiveCallbacks;
var serverSocketId;


function Server(argPort) {
  this.port = parseInt(argPort);
}

Server.prototype.addEventListener = function(evtName, callback) {
  if (evtName == 'accept') {
    if (!acceptCallbacks) {
      acceptCallbacks = [callback];
    } else {
      acceptCallbacks.push(callback);
    }
  } else if (evtName == 'receive') {
    if (!receiveCallbacks) {
      receiveCallbacks = [callback];
    } else {
      receiveCallbacks.push(callback);
    }
  } else {
    throw new Exception('Invalid event name: ' + evtName);
  }
};

Server.prototype.start = function() {
  tcpServer.create({}, function(socketInfo) {
    serverSocketId = socketInfo.socketId;

    tcpServer.listen(serverSocketId, '127.0.0.1', this.port, 50, function(result) {
      console.log('LISTENING: ', result);
      
      var receiveWrapper = function(receiveInfo) {
        if (receiveCallbacks) {
          var msg = bufferToString(receiveInfo.data);
          for (var x = 0; x < receiveCallbacks.length; x++) {
            var cb = receiveCallbacks[x];
            cb(msg, receiveInfo.socketId);
          }
        }
      };

      var acceptWrapper = function(acceptInfo) {
        acceptCallbackWrapper(acceptInfo);
        if (acceptCallbacks) {
          for (var x = 0; x < acceptCallbacks.length; x++) {
            var cb = acceptCallbacks[x];
            cb(acceptInfo);
          }
        }
      }

      tcpServer.onAccept.addListener(acceptWrapper);
      tcpSocket.onReceive.addListener(receiveWrapper);
    });
  }.bind(this));
};
          
Server.prototype.stop = function() {
  if (!serverSocketId) {
    console.error('STOP:No socket id to stop');
    return;
  }

  tcpServer.close(serverSocketId, function() {
    if (chrome.runtime.lastError) {
      console.warn('chrome.sockets.tcpServer.close: ', chrome.runtime.lastError);
    }
  });
}

Server.prototype.destroy = function(socketId) {
  console.log('DESTROY:',socketId);
  tcpSocket.disconnect(socketId, function() {
    tcpSocket.close(socketId);
  });
}

Server.prototype.send = function(msg, socketId, keepAlive) {

  var keepAlive = false;
  var buf = stringToBuffer(msg);

  tcpSocket.getInfo(socketId, function(socketInfo) {
    if (!socketInfo.connected) {
      console.warn('WRITE:Socket is dead!');
      this.destroy(socketId);
      return;
    }

    tcpSocket.send(socketId, buf, function(writeInfo) {
      if (!chrome.runtime.lastError) {
        console.log('WRITE:', "socket: ", socketId,  writeInfo);
        console.log('WRITE:',buf);
      } else {
        console.warn('chrome.sockets.tcp.send:', chrome.runtime.lastError);
      }
      
      if (keepAlive) {
        console.log('WRITE:Keeping socket alive');
      } else {
        console.log('WRITE:Destroying socket');
        this.destroy(socketId);
      }
    }.bind(this));
  }.bind(this));
}

module.exports = Server; 
