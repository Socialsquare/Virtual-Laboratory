/**
 * Global variables.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'backbone',
	'models/lab'
], function(_, Backbone, Lab) {
	var API_URL = 'http://virtueltlaboratorium.dk/api/';
	//var API_URL = 'http://virtueltlaboratorium.site/api/';

	return {
		isWeb: false,
		router: null,
		mail: false,
		API_URL: API_URL,
		lab: new Lab(),
		topMenuView: null,
		menuView: null,
		videos: null,
		quiz: null
	};
});