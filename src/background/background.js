function _messageCallback(request, sender, sendResponse) {
  console.log('Message:');
  console.log(request);
  console.log(sender);
}

chrome.runtime.onMessageExternal.addListener(_messageCallback);
 
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 1000,
      'height': 500
    }
  });
});
