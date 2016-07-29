//FIRSTTIME INSTALLS
chrome.runtime.onInstalled.addListener(onInstalled);

function onInstalled(object) {

    //console.log('SEND NOTIFICATION', timeer);
    var opt = {
        type: "basic",
        title: "Yikes!",
        message: "Yikes has been installed",
        iconUrl: "images/chrome-logo.png",
        buttons: [{
                   title: "Get me started!"
                   //iconUrl: "images/chrome-logo.png"
               }]
    }
    chrome.notifications.create('1', opt, creationCallback);
}

function creationCallback(event) {
    console.log('creationCallback', event);
}

function destroyNotifications(wasCleared) {
    console.log('destroyNotifications', wasCleared);
}
//new install clicked:
chrome.notifications.onButtonClicked.addListener(onButtonClicked);
//create a new window
function onButtonClicked(event) {
	chrome.tabs.create(
		{
			url: 'chrome://newtab',
			active: true
		});
	//window.open("chrome-extension://lagbklomealkbhffdagchmalndhafanh/index.html#/", '_blank');	
}