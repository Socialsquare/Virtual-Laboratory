/**
 * Handles communication with the PhoneGap environment.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
define(['cordova'], function(cordova) {
	var EVENT_DEVICEREADY = "deviceready";
	
	var app = {
		callback: null,
		initialize: function(callback) {
			this.callback = callback;
			this.bindEvents();
		},
		bindEvents: function() {
			document.addEventListener(EVENT_DEVICEREADY, this.onDeviceReady, false);
		},
		onDeviceReady: function() {
			app.receivedEvent(EVENT_DEVICEREADY);
		},
		receivedEvent: function(event) {
			switch(event) {
				case EVENT_DEVICEREADY:
					this.callback();
					break;
			}
		}
	};
	
	return app;
});