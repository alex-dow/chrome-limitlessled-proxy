var bindings = require('./bindings.js');

window.addEventListener('load', function() {

/*
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
  console.log('Received external message');
  console.log(request);
  console.log(sender);
});
*/
bindings();

});
