/**
 * Utility functions.
 * @author: Chris Hjorth, www.chrishjorth.com
 */

define([
	'underscore',
	'backbone',
	'globals'],
function(_, Backbone, Globals) {
	var openURLInNativeBrowser = function(url) {
		window.open(url, '_system');
	};
	
	var openLocationInNativeMaps = function(address) {
		var encodedAddress = encodeURIComponent(address);
		var mapsURLScheme = "http://maps.google.com/?q=1200%20" + encodedAddress;
		
		if(!Globals.isWeb) {
			if(device.platform == "iOS") {
				mapsURLScheme = "http://maps.apple.com/?q=" + encodedAddress;
			}
		
			if(device.platform == "Android") {
				mapsURLScheme = "geo:0,0?q=" + encodedAddress;
			}
		}
		
		window.open(mapsURLScheme, '_system');
	};
	
	var mergeObjects = function(object1, object2) {
		var merger = {};
		var propertyName;
		for(propertyName in object1) {
			merger[propertyName] = object1[propertyName];
		}
		for(propertyName in object2) {
			merger[propertyName] = object2[propertyName];
		}
		return merger;
	};
	
	return {
		openURLInNativeBrowser: openURLInNativeBrowser,
		openLocationInNativeMaps: openLocationInNativeMaps,
		mergeObjects: mergeObjects
	};
});
