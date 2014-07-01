/**
 * Main appOriginals controller.
 * @author: Chris Hjorth, www.chrishjorth.com
 */

define([
	'jquery',
	'underscore', 
	'backbone',
	'globals',
	'router',
	'views/menu',
	'views/top-menu',
	'views/video',
	'views/popup-quiz'],
function($, _, Backbone, Globals, Router, MenuView, TopMenuView, VideoView, QuizView) {
	var jQueryReady = $.Deferred();
	var pgReady = $.Deferred();

	//Based on http://stackoverflow.com/a/2401861
	navigator.sayswho= (function(){
		var userAgent= navigator.userAgent;
		var temp;
		var browserInfo = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
		if(/trident/i.test(browserInfo[1])){
			temp = /\brv[ :]+(\d+(\.\d+)?)/g.exec(userAgent) || [];
			return 'IE ' + (temp[1] || '');
		}
		browserInfo = browserInfo[2] ? [browserInfo[1], browserInfo[2]] : [navigator.appName, navigator.appVersion, '-?'];
		temp = userAgent.match(/version\/([\.\d]+)/i);
		if(temp !== null) {
			browserInfo[2]= browserInfo[1];
		}
		return browserInfo;
	})();
	
	var initialize = function(isWeb) {
		Globals.isWeb = isWeb;
		if(isWeb) {
			pgReady.resolve();
		}
		else {
			//Globals.isWeb = false;
			console.log('lets load chc-phonegap');
			require(['chc-phonegap'], function(pg) {
				pg.initialize(function() {
					pgReady.resolve();
				});
			});
		}
	};
	
	$(document).ready(function() {
		jQueryReady.resolve();
	});
	
	$.when(pgReady, jQueryReady).then(function() {
		$('body').on('dragstart', 'img', null, function(event) { event.preventDefault(); });

		if(Globals.isWeb && navigator.sayswho[0].toLowerCase() == 'safari') {
			$('body').addClass('osxsafari');
		}
		Globals.router = Router;
		console.log("Virtuelt Laboratorium app initialized.");
		Router.navigate('main', true);
		Globals.topMenuView = new TopMenuView();
		Globals.topMenuView.render();
		Globals.menuView = new MenuView();
		Globals.menuView.render();
		Globals.videos = new VideoView();
		Globals.quiz = new QuizView();
	});
		
	return {
		initialize: initialize
	};
});