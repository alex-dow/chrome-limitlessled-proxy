// -----------
// Controller
//
// Routes commands from messages to milight
// ----------

/**
 * Valid commands
 */
var cmds = ['on','off','color','brightness'];


var Controller = function(milight) {
  this.milight = milight;
}

Controller.prototype.init = function() {
  chrome.runtime.onMessage.addListener(this.router.bind(this));
  chrome.runtime.onMessageExternal.addListener(this.router.bind(this));
};

Controller.prototype.isValidCmd = function(cmd) {
  return (cmds.indexOf(cmd) > -1);
}

Controller.prototype.router = function(request, sender) {
  
 if (!('cmd' in request)) {
   console.error('Missing "cmd" property from message');
 }

 var cmd = request.cmd;

 if (!this.isValidCmd(cmd)) {
   console.error('Invalid cmd: ', cmd);
 }

 var cmdMethod = 'cmd_' + cmd;

 if (this[cmdMethod] && typeof this[cmdMethod] == 'function') {
   this[cmdMethod](request);
 } else {
   console.error('Command not implemented: ', cmd);
 }

}

Controller.prototype.cmd_on = function(cmd) {
  var group = cmd.group || null;
  this.milight.on(group);
}

Controller.prototype.cmd_off = function(cmd) {
  var group = cmd.group || null;
  this.milight.off(group);
}

module.exports = Controller;
