
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	  sendResponse({apikey: localStorage.getItem("apikey")});
  });
		  