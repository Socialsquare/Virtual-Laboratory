/**
 * Backbone view controller for the mouse view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'chcdraggable',
	'chcdroppable',
	'chcdraggablespawner',
	'flot',
	'globals',
	'text!../../templates/mouse.html',
	'views/popup-ok',
	'models/container-content'
], function($, _, Backbone, chcDraggable, chcDroppable, chcDraggableSpawner, Flot, Globals, mouseViewTemplate, popupOKView, ContainerContent) {
	var mouseView = Backbone.View.extend({
		template: _.template(mouseViewTemplate),
		popupOKView: new popupOKView(),
		graphIntervalID: null,
		initialize: function(options) {
			this.viewID = options.viewID;
		},
		close: function() {
			this.unbindEvents();
			this.$el.html('');
			$('.offscreen').html('');
		},
		updateSubviewElements: function() {
		},
		render: function() {
			this.renderTemplate();
			this.bindEvents();
			return this;
		},
		renderTemplate: function() {
			var variables = {
				title: 'Musen'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);
			
			$('.mouse-view .video-container').append('<video id="mouse-video-runfast" class="offscreen" preload="auto" ><source src="videos/runFast.mp4" type="video/mp4" /><source src="videos/runFast.webm" type="video/webm" /></video>');
			$('.mouse-view .video-container').append('<video id="mouse-video-drinkstart" class="offscreen" preload="auto"><source src="videos/runFast_drink_spawn.mp4" type="video/mp4" /><source src="videos/runFast_drink_spawn.webm" type="video/webm" /></video>');
			$('.mouse-view .video-container').append('<video id="mouse-video-drinkloop" class="offscreen" preload="auto"><source src="videos/runFast_drink_loop.mp4" type="video/mp4" /><source src="videos/runFast_drink_loop.webm" type="video/webm" /></video>');
			$('.mouse-view .video-container').append('<video id="mouse-video-inj" class="offscreen" preload="auto"><source src="videos/runFast_inj.mp4" type="video/mp4" /><source src="videos/runFast_inj.webm" type="video/webm" /></video>');
			$('.mouse-view .video-container').append('<video id="mouse-video-injdie" class="offscreen" preload="auto"><source src="videos/poi1_inj.mp4" type="video/mp4" /><source src="videos/poi1_inj.webm" type="video/webm" /></video>');
			$('.mouse-view .video-container').append('<video id="mouse-video-cut" class="offscreen" preload="auto"><source src="videos/poi3_cut.mp4" type="video/mp4" /><source src="videos/poi3_cut.webm" type="video/webm" /></video>');

			//this.loadState();
		},
		bindEvents: function() {
			var mouseData = getMouseData([]);

			var plot = $.plot($(".mousegraph"), [getPlotData(mouseData)], {
				yaxis: {
					min: 0,
					max: 100
				},
				xaxis: {
					show: false
				} 
			});

			this.graphIntervalID = window.setInterval(function() {
				mouseData = getMouseData(mouseData);
				plot.setData([getPlotData(mouseData)]);
				plot.draw();
			}, 30);
			
			$('.mouse-view .draggable').chcDraggable();
			$('.mouse-view').on('chcDraggableStart.chcEvent', '.draggable', this, handleStartDrag);
			$('.mouse-view').on('chcDraggableDroppedOut.chcEvent', '.draggable', this, handleDroppedOut);
			$('.mouse-view').on('chcDraggableSpawnDroppedOut.chcEvent', '#mouse', this, handleSpawnDroppedOut);

			$('.mouse-view .droppable').chcDroppable();
			$('#mouse').on('chcDroppableDrop.chcEvent', null, this, handleDropOnMouse);
		},
		unbindEvents: function() {
			$('.mouse-view').off('chcDraggableStart.chcEvent', '.draggable', handleStartDrag);
			$('.mouse-view').off('chcDraggableDroppedOut.chcEvent', '.draggable', handleDroppedOut);
			$('.mouse-view .draggable').chcDraggable('destroy');
			$('#mouse').off('chcDroppableDrop.chcEvent', handleDropOnMouse);
			$('.mouse-view .droppable').chcDroppable('destroy');
			
			stopAnimations();

			window.clearInterval(this.graphIntervalID);
		},
		loadState: function() {
			var mouse = Globals.lab.get('mouse'),
				$deadMouse = $('#dead_mouse');
			if(mouse.attributes.alive === false) {
				$deadMouse.removeClass('hidden');
				if(mouse.attributes.cut === true) {
					if(mouse.attributes.spleen === true) {
						addDraggableSpleen();
					}
					else {
						$deadMouse.addClass('cut');
					}
				}
			}
		},
		viewDidLoad: function() {
			var view = this,
				mouseVideos = ['#mouse-video-runfast', '#mouse-video-drinkstart', '#mouse-video-drinkloop', '#mouse-video-inj', '#mouse-video-injdie', '#mouse-video-cut'],
				videoLoader;

			videoLoader = function(videos) {
				var mouse = Globals.lab.get('mouse'),
					$video, video;
				if(videos.length <= 0) {
					console.log('All videos loaded in mouse scene');
					view.loadState();
					if(mouse.attributes.alive === true) {
						mouseRunStart();
					}
					return;
				}
				$video = $(videos[0]);
				video = $video.get(0);
				$video.one('loadeddata', function(event) {
					videos.shift();
					videoLoader(videos);
				});
				video.load();
			};
			videoLoader(mouseVideos);
		}
	});
	
	return mouseView;
	
	
	/* !EVENT HANDLERS */
	
	function handleVideoEnd(event) {
		this.play();
	}
	
	function handleDropOnMouse(event, $draggable) {
		//Figure out what was droppen in mouse
		var view = event.data,
			id = $draggable.prop('id'),
			mouse = Globals.lab.get('mouse');
		switch(id) {
			case 'water-bottle':
				$draggable.removeClass('visible');
				mouseDrinkingStart();
				return;
		}
		if($draggable.hasClass('needle')) {
			mouseNeedle($draggable.data('content'));
			$draggable.remove();
			return;
		}
		if($draggable.hasClass('scalpel')) {
			if(mouse.attributes.alive === false) {
				mouseScalpel();
				$draggable.remove();
				return;
			}
			else {
				view.popupOKView.show('Kan ikke udføres', 'Musen skal være død.');
			}
			
		}

		$draggable.chcDraggable('returnToOriginalPosition');
	}

	function handleStartDrag(event) {
		var $draggable = $(this),
			id = $draggable.attr('id'),
			$scene;
		if(id === 'water-bottle') {
			$scene = event.data.$el.find('.mouse-view');
			$scene.addClass('no-bottle');
			$draggable.addClass('visible');
		}
	}

	function handleDroppedOut(event) {
		var $draggable = $(this),
			id = $draggable.attr('id'),
			mouse = Globals.lab.get('mouse'),
			$scene, $deadMouse;
		console.log('DROPPED OUT');
		if(id === 'water-bottle') {
			$scene = event.data.$el.find('.view');
			$draggable.removeClass('visible');
			$scene.removeClass('no-bottle');
		}
		if($draggable.hasClass('spleen') === true) {
			console.log('Dropped out spleen');
			
		}
	}

	function handleSpawnDroppedOut(event) {
		var mouse = Globals.lab.get('mouse');
		mouse.attributes.spleen = true;
		addDraggableSpleen();
	}
	
	/* !ANIMATION HANDLERS */
	//TODO: Complete this one
	function stopAnimations() {
		mouseRunStop();
	}
	
	function mouseRunStart() {
		var $video = $('#mouse-video-runfast');
		var video = $video.get(0);
		$video.removeClass('offscreen');
		video.play();
		mouseRunLoop();
	}
	
	function mouseRunLoop() {
		var $video = $('#mouse-video-runfast');
		$video.on('ended', handleVideoEnd);
	}
	
	function mouseRunStop() {
		var $video = $('#mouse-video-runfast');
		var video = $video.get(0);
		video.pause();
		video.currentTime = '0';
		$video.off('ended', handleVideoEnd);
		$video.addClass('offscreen');
	}
	
	function mouseDrinkingStart() {
		var $video = $('#mouse-video-drinkstart');
		var video = $video.get(0);
		var $loopVideo = $('#mouse-video-drinkloop');
		var loopVideo = $loopVideo.get(0);
		
		mouseRunStop();
		
		$video.removeClass('offscreen');
		video.play();
		$video.one('ended', function() {
			mouseDrinkingLoop();
		});
	}
	
	function mouseDrinkingLoop() {
		var $video = $('#mouse-video-drinkloop');
		var video = $video.get(0);
		var $startVideo = $('#mouse-video-drinkstart');
		var startVideo = $startVideo.get(0);
		$startVideo.addClass('offscreen');
		$video.removeClass('offscreen');
		video.play();
		startVideo.pause();
		$video.on('ended', function() {
			mouseDrinkingStop();
			mouseRunStart();
			var $bottle = $('#water-bottle');
			$bottle.addClass('visible');
			$bottle.chcDraggable('returnToOriginalPosition', function() {
				$bottle.removeClass('visible');
				$('.mouse-view').removeClass('no-bottle');
				$(document.body).trigger('task:INST_BOTTLE:ACTION_DRINK');
			});
		});
	}
	
	function mouseDrinkingStop() {
		var $video = $('#mouse-video-drinkloop');
		$video.get(0).pause();
		$video.off('ended', handleVideoEnd);
		$video.addClass('offscreen');
	}
	
	function mouseNeedle(content) {
		var $video, video;
		mouseRunStop();
		if(content && content.hasOther('death')) {
			$video = $('#mouse-video-injdie');
			video = $video.get(0);
			$video.removeClass('offscreen');
			$video.one('ended', function(event) {
				var mouse = Globals.lab.get('mouse');
				mouse.attributes.alive = false;
				video.pause();
				video.currentTime = 0;
				$video.addClass('offscreen');
				$('#dead_mouse').removeClass('hidden');
			});
		}
		else {
			$video = $('#mouse-video-inj');
			video = $video.get(0);
			$video.removeClass('offscreen');
			$video.one('ended', function(event) {
				video.pause();
				video.currentTime = 0;
				$video.addClass('offscreen');
				mouseRunStart();
			});
		}

		video.play();
	}

	function mouseScalpel() {
		var $video = $('#mouse-video-cut'),
			video = $video.get(0);
		$video.removeClass('offscreen');
		$video.one('ended', function(event) {
			var $mouseDroppable = $('#mouse'),
				$deadMouse = $('#dead_mouse'),
				mouse = Globals.lab.get('mouse');
			video.pause();
			video.currentTime = 0;
			$video.addClass('offscreen');
			mouse.attributes.cut = true;
			addDraggableSpleen();
		});
		video.play();
	}

	function addDraggableSpleen() {
		var $mouseDroppable = $('#mouse'),
			$deadMouse = $('#dead_mouse');
		$deadMouse.removeClass('cut');
		$deadMouse.addClass('cut-with-spleen');
		$mouseDroppable.addClass('draggablespawner');
		$mouseDroppable.chcDraggableSpawner({
			styleClass: 'draggablespawn-popuplist',
			additionalClasses: 'spleen',
			spawnHTML: '<img src="img/icon_spleen.png" />',
			content: new ContainerContent({
				other: ['spleen']
			})
		});
		$mouseDroppable.one('chcDraggableSpawned.chcEvent', function(event) {
			var mouse = Globals.lab.get('mouse');
			$deadMouse.removeClass('cut-with-spleen');
			$deadMouse.addClass('cut');
			$mouseDroppable.chcDraggableSpawner('destroy');
			$mouseDroppable.removeClass('draggablespawner');
			mouse.attributes.spleen = false;
		});
	}

	/* GRAPH MANIPULATION */
	function getMouseData(mouseData) {
		if(mouseData.length > 0) {
			mouseData = mouseData.slice(1);
		}
		
		while(mouseData.length < 250) {
			var prev = mouseData.length > 0 ? mouseData[mouseData.length - 1] : 50;
			var y = prev + Math.random() * 10 - 5;
			if (y < 0) {
				y = 0;
			}
			else if (y > 100) {
				y = 100;
			}
			mouseData.push(y);
		}

		return mouseData;
	}

	function getPlotData(data) {
		var res = [];
		for (var i = 0; i < data.length; i++) {
			res.push([i, data[i]]);
		}
		return res;
	}
});