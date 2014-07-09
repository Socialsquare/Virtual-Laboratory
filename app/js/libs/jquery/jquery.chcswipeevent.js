/**
 * Adds following events:
 * swiperight: the users swipes from left to right, mapped to a mousedrag from left to right.
 */
 
define([
	'jquery'
], function($) {
	var PLUGIN_NAME = "chcSwipeEvent";
	
	var methods = {
		init: function() {
			return init.apply(this);
		},
		destroy: function() {
			return destroy.apply(this);
		}
	};
	
	$.fn.chcSwipeEvent = function() {
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method) {
			return methods.init.apply(this);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.' + PLUGIN_NAME);
		}
	};
});