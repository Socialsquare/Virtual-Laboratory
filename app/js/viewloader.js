/**
 * Handles display of views with Backbone. Designed to be called by the Router.
 * @author: Chris Hjorth, www.chrishjorth.com
 * @version: 16-01-14 alpha
 */
// !TODO: Check that all views unbind events properly
define([
	'jquery',
	'underscore',
	'backbone',
	'utilities'
], function($, _, Backbone, Utilities) {
	var segues = new Array(13);
	var i;
	for(i = 0; i < segues.length; i++) {
		segues[i] = new Array(13);
	}
	
	segues[1] = [];
	segues[1][2] = 'fade';
	segues[1][3] = 'fade';
	segues[1][4] = 'fade';
	segues[1][5] = 'fade';
	segues[1][6] = 'fade';
	segues[1][7] = 'fade';
	segues[1][8] = 'fade';
	segues[1][9] = 'fade';
	segues[1][10] = 'fade';
	segues[1][11] = 'fade';
	segues[1][12] = 'fade';
	segues[1][14] = 'fade';
	segues[2] = [];
	segues[2][1] = 'fade';
	segues[2][11] = 'fade';
	segues[3] = [];
	segues[3][1] = 'fade';
	segues[3][11] = 'fade';
	segues[4] = [];
	segues[4][1] = 'fade';
	segues[4][11] = 'fade';
	segues[4][13] = 'fade';
	segues[5] = [];
	segues[5][1] = 'fade';
	segues[5][11] = 'fade';
	segues[6] = [];
	segues[6][1] = 'fade';
	segues[6][11] = 'fade';
	segues[7] = [];
	segues[7][1] = 'fade';
	segues[7][11] = 'fade';
	segues[8] = [];
	segues[8][1] = 'fade';
	segues[8][11] = 'fade';
	segues[9] = [];
	segues[9][1] = 'fade';
	segues[9][11] = 'fade';
	segues[10] = [];
	segues[10][1] = 'fade';
	segues[10][11] = 'fade';
	segues[11] = [];
	segues[11][1] = 'fade';
	segues[11][2] = 'fade';
	segues[11][3] = 'fade';
	segues[11][4] = 'fade';
	segues[11][5] = 'fade';
	segues[11][6] = 'fade';
	segues[11][7] = 'fade';
	segues[11][8] = 'fade';
	segues[11][9] = 'fade';
	segues[11][10] = 'fade';
	segues[11][12] = 'fade';
	segues[11][13] = 'fade';
	segues[11][14] = 'fade';
	segues[12] = [];
	segues[12][1] = 'fade';
	segues[12][11] = 'fade';
	segues[13] = [];
	segues[13][4] = 'fade';
	segues[13][11] = 'fade';
	segues[14] = [];
	segues[14][1] = 'fade';
	segues[14][11] = 'fade';
	
	
	var ViewLoader = {
		currentView: null,
		changeView: function(parameters) {
			var view = arguments[0];
			switch(view) {
				case 'welcome':
					require(['views/welcome'], function(WelcomeView) {
						loadView(WelcomeView, {viewID: 0});
					});
					break;
				case 'main':
					require(['views/main'], function(MainView) {
						loadView(MainView, {viewID: 1});
					});
					break;
				case 'uv':
					require(['views/uv'], function(View) {
						loadView(View, {viewID: 2});
					});
					break;
				case 'worktable2':
					require(['views/worktable2'], function(Worktable2View) {
						loadView(Worktable2View, {viewID: 3});
					});
					break;
				case 'fermentor':
					require(['views/fermentor'], function(FermentorView) {
						loadView(FermentorView, {viewID: 4});
					});
					break;
				case 'chromatograph-screen':
					require(['views/chromatograph-screen'], function(View) {
						loadView(View, {viewID: 13});
					});
					break;
				case 'hplc':
					require(['views/hplc'], function(HPLCView) {
						loadView(HPLCView, {viewID: 5});
					});
					break;
				case 'worktable1':
					require(['views/worktable1'], function(Worktable1View) {
						loadView(Worktable1View, {viewID: 6});
					});
					break;
				case 'hood':
					require(['views/hood'], function(HoodView) {
						loadView(HoodView, {viewID: 7});
					});
					break;
				case 'chemicalcloset':
					require(['views/chemicalcloset'], function(ChemicalClosetView) {
						loadView(ChemicalClosetView, {viewID: 8});
					});
					break;
				case 'mouse':
					require(['views/mouse'], function(MouseView) {
						loadView(MouseView, {viewID: 9});
					});
					break;
				case 'washingmachine':
					require(['views/washingmachine'], function(WashingMachineView) {
						loadView(WashingMachineView, {viewID: 10});
					});
					break;
				case 'computer':
					require(['views/computer'], function(ComputerView) {
						loadView(ComputerView, {viewID: 11});
					});
					break;
				case 'incubator':
					require(['views/incubator'], function(IncubatorView) {
						loadView(IncubatorView, {viewID: 12});
					});
					break;
				case 'spectrophotometer':
					require(['views/spectrophotometer'], function(View) {
						loadView(View, {viewID: 14});
					});
					break;
				default:
					console.log('Could not find view: ' + view);
			}
		}
	};
	
	var loadView = function(viewController, parameters) {
		if(ViewLoader.currentView) {
			transitionToView(viewController, parameters);
		}
		else {
			ViewLoader.currentView = new viewController(Utilities.mergeObjects(parameters, {el: $('#index-current-view')}));
			ViewLoader.currentView.render();
			if(ViewLoader.currentView.viewDidLoad) {
				ViewLoader.currentView.viewDidLoad();
			}
		}
		
		//Fix that solves issue with the software keyboard screwing up the view render, specifically the fixed position navigation bar.
		$('input[type=text], input[type=email], input[type=password]').on('blur', function(event) {
			window.scrollTo(0, 0);
		});
	};
	
	var transitionToView = function(newViewController, parameters) {
		//Load new view into transition-view-container
		var $indexCurrentView = $('#index-current-view');
		var $indexTransitionView = $('#index-transition-view');
		var newView = new newViewController(Utilities.mergeObjects(parameters, {el: $indexTransitionView}));
		//We separate template rendering and event binding since events break anyhow when we move nodes in the DOM
		newView.renderTemplate();
		
		$indexTransitionView.css({
			'z-index': 4
		});
		
		var positionClass = '';
		var transitionClass = '';
		var $newView = $('.transition-view .view');
		var $currentView = $('.current-view .view');
		$currentView.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(event) {
			ViewLoader.currentView.close(); //The old view is animated away from the users view and removed from memory
			ViewLoader.currentView = newView;
			
			//Move the view from the transition container to the view container
			ViewLoader.currentView.setElement($indexCurrentView);
			$newView.removeClass(positionClass); //We don't want to copy the transition class
			$indexCurrentView.html($indexTransitionView.html()); //Swap HTML, render has already been called, this destroys all event bindings for subviews!
			ViewLoader.currentView.updateSubviewElements();
			
			//Reset transition view for a new transition
			$indexTransitionView.off('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd');
			$indexTransitionView.html('');
			$('.view').removeClass(transitionClass + '-transition');
			$('.view').removeClass(transitionClass);
			
			$indexTransitionView.css({
				'z-index': 0
			});
			
			ViewLoader.currentView.bindEvents(); //The elements in the transition view need to be removed in order to avoid duplicate registrations
			
			if(ViewLoader.currentView.viewDidLoad) {
				ViewLoader.currentView.viewDidLoad();
			}
		});
		
		var transition = segues[ViewLoader.currentView.viewID][newView.viewID];
		switch(transition) {
			case 'fade':
				positionClass = 'fade-setup';
				//$indexTransitionView.find('.view').addClass(positionClass);
				$newView.addClass(positionClass);
				transitionClass = 'fade';
				break;
			default:
				//console.log('No transition specified in current view.');
				$newView.trigger('transitionend');
		}
		
		if(transitionClass !== '') {
			//Delay that allows the transition view to be positioned without triggering a transition. The positionClass needs to be rendered first.
			setTimeout(function() {
				$('.view').addClass(transitionClass + '-transition');
				$('.view').addClass(transitionClass);
			}, 1);
		}
	};
	
	return ViewLoader;
});
