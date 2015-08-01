chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("Converting to Canvas");
	//$(document.body).css("background-color","blue");
	//chrome.tabs.executeScript(null, {"file":"getcanvas.js"});



	chrome.tabs.captureVisibleTab(function(screenshotUrl) {
		var w = 1400;
        var h = 700;
		var left = (screen.width/2)-(w/2);
		var top = (screen.height/2)-(h/2);
		var tabUrl = chrome.extension.getURL('canvas.htm')
		
		
		chrome.windows.create({'url': tabUrl, 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {
		     
			 var views = chrome.extension.getViews();
			 for (var i = 0; i < views.length; i++) {
				var view = views[i];
				console.log(""+view.location.href);
				if (view.location.href == tabUrl) {
				  console.log("img url = "+screenshotUrl);
				  view.setCanvasImage(screenshotUrl);
				  break;
				}
			  }
		});
	});
});