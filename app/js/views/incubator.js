/**
 * Backbone view controller for the incubator view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/incubator.html',
], function($, _, Backbone, Globals, incubatorViewTemplate) {
	var incubatorView = Backbone.View.extend({
		template: _.template(incubatorViewTemplate),
		initialize: function(options) {
			this.viewID = options.viewID;
		},
		close: function() {
			this.unbindEvents();
			this.$el.html('');
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
				title: 'Inkubatoren'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);

			this.loadState();
		},
		bindEvents: function() {
			var $view = $('.incubator-view');
			$view.on('click', '#incubator-btn', this, toggleIncubator);
			$view.on('click', '#incubator-timeup-btn', this, timeUp);
			$view.on('click', '#incubator-timedown-btn', this, timeDown);
			$view.on('click', '#incubator-tempup-btn', this, tempUp);
			$view.on('click', '#incubator-tempdown-btn', this, tempDown);
			this.displayInterval = setInterval(updateFunction(this), 1000);
			
			$('.droppable', $view).chcDroppable();
			$view.on('chcDroppableDrop.chcEvent', '.droppable', this, handleDrop);

			$('.draggable', $view).chcDraggable();
			$view.on('chcDraggableStart.chcEvent', '.draggable', this, handleStartDrag);
			$view.on('chcDraggableDroppedOut.chcEvent', '.draggable', this, handleDroppedOut);
		},
		unbindEvents: function() {
			var $view = $('.incubator-view');
			$view.off('click', '#incubator-btn', toggleIncubator);
			$view.off('click', '#incubator-timeup-btn', timeUp);
			$view.off('click', '#incubator-timedown-btn', timeDown);
			$view.off('click', '#incubator-tempup-btn', tempUp);
			$view.off('click', '#incubator-tempDown-btn', tempDown);
			clearInterval(this.displayInterval);

			$view.off('chcDroppableDrop.chcEvent', '.droppable', this, handleDrop);
			$('.droppable', $view).chcDroppable('destroy');

			$view.off('chcDraggableStart.chcEvent', '.draggable', this, handleStartDrag);
			$view.off('chcDraggableDroppedOut.chcEvent', '.draggable', this, handleDroppedOut);
			$('.draggable', $view).chcDraggable('destroy');
		},
		loadState: function() {
			//Check if incubator is running
			var incubator = Globals.lab.get('incubator'),
				$incubatorView;

			$incubatorView = $('.incubator-view', this.$el);
			if(incubator.get('state') === true) {
				$incubatorView.append('<div class="cover"></div>');
			}

			renderTestTubes();
			renderPetridishes();
		}
	});
	
	return incubatorView;

	function renderTestTubes() {
		var incubator = Globals.lab.get('incubator'),
			testTubes = incubator.attributes.testTubes,
			i, emptyOrFull;
		for(i = 0; i < testTubes.length; i++) {
			if(testTubes[i] !== null) {
				$('#incubator-testtube-holder ul li:nth-child(' + (i + 1) + ')').html('<div class="draggable testtube"><img src="img/incubator_tube' + (i + 1) + '.png" alt="Test tube" /></div>');
			}
		}
	}
	
	function renderPetridishes() {
		var incubator = Globals.lab.get('incubator'),
			petridishes = incubator.attributes.petridishes,
			i, emptyOrFull;
		for(i = 0; i < petridishes.length; i++) {
			if(petridishes[i] !== null) {
				$('#incubator-petridish-level ul li:nth-child(' + (i + 1) + ')').html('<div class="draggable testtube"><img src="img/incubator_dish' + (i + 1) + '.png" alt="Test tube" /></div>');
			}
		}
	}

	/* !EVENT HANDLERS */
	function toggleIncubator(event) {
		var view = event.data,
			incubator = Globals.lab.get('incubator'),
			$incubatorView;
		var handleDoor = function() {
			$incubatorView = $('.incubator-view', view.$el);
			$('.cover', $incubatorView).remove();
			if(incubator.get('state')) {
				$incubatorView.append('<div class="cover"></div>');
			}
		};
		
		incubator.toggle(function() {
			handleDoor();
		});
		handleDoor();
	}

	function timeUp(event) {
		var incubator = Globals.lab.get('incubator'),
			view = event.data;
		incubator.timeUp();
		updateDisplays(view);
	}

	function timeDown(event) {
		var incubator = Globals.lab.get('incubator'),
			view = event.data;
		incubator.timeDown();
		updateDisplays(view);
	}

	function tempUp(event) {
		var incubator = Globals.lab.get('incubator'),
			view = event.data;
		incubator.tempUp();
		updateDisplays(view);
	}

	function tempDown(event) {
		var incubator = Globals.lab.get('incubator'),
			view = event.data;
		incubator.tempDown();
		updateDisplays(view);
	}

	function updateFunction(view) {
		var returnFunction = function(event) {
			updateDisplays(view);
		};
		return returnFunction;
	}

	function updateDisplays(view) {
		var incubator = Globals.lab.get('incubator'),
			minutes, seconds;
		$('.time', view.$view).html(incubator.get('time') + ' h');
		$('.temperature', view.$view).html(incubator.get('temperature') + ' &deg;C');
	}

	function handleDrop(event, $draggable) {
		var $droppable = $(this),
			view = event.data;

		event.stopPropagation();
		event.preventDefault();

		if($droppable.hasClass('testtube-holder-slot')) {
			handleDropTesttube(view, $droppable, $draggable);
			return;
		}

		if($droppable.hasClass('petridish-slot')) {
			handleDropPetridish(view, $droppable, $draggable);
			return;
		}

		$draggable.chcDraggable('returnToOriginalPosition');
	}

	function handleDropTesttube(view, $testTubeSlot, $draggable) {
		var incubator = Globals.lab.get('incubator'),
			position = $testTubeSlot.index();

		if($draggable.hasClass('testtube') && incubator.isTubeSlotEmpty(position)) {
			incubator.addTestTubeAtPos($draggable.data('content'), position);

			$draggable.removeAttr('style');
			$draggable.removeClass('draggablespawn draggablespawn-popuplist');
			$draggable.off();
			$draggable.chcDraggable('destroy');
			
			$draggable.chcDraggable();
			$draggable.html('<img src="img/incubator_tube' + (position + 1) + '.png" alt="Test tube" />');
			$testTubeSlot.append($draggable);
			return;
		}

		$draggable.chcDraggable('returnToOriginalPosition');
	}

	function handleDropPetridish(view, $petridishSlot, $draggable) {
		var incubator = Globals.lab.get('incubator'),
			position = $petridishSlot.index();

		if($draggable.hasClass('petridish') && incubator.isDishSlotEmpty(position)) {
			incubator.addPetridishAtPos($draggable.data('content'), position);

			$draggable.removeAttr('style');
			$draggable.removeClass('draggablespawn draggablespawn-popuplist');
			$draggable.off();
			$draggable.chcDraggable('destroy');
			
			$draggable.chcDraggable();
			$draggable.html('<img src="img/incubator_dish' + (position + 1) + '.png" alt="Petridish" />');
			$petridishSlot.append($draggable);
			return;
		}

		$draggable.chcDraggable('returnToOriginalPosition');
	}

	function handleStartDrag(event) {
		var $draggable = $(this),
			incubator = Globals.lab.get('incubator'),
			position = $draggable.parent().index();

		if($draggable.hasClass('testtube')) {
			$draggable.html('<img src="img/icon_cup_tube.png" />');
			$draggable.data('position', position);
			$draggable.data('content', incubator.attributes.testTubes[position]);
			incubator.removeTube(position);
		}

		if($draggable.hasClass('petridish')) {
			$draggable.html('<img src="img/icon_cup_petri.png" />');
			$draggable.data('position', position);
			$draggable.data('content', incubator.attributes.petridishes[position]);
			incubator.removeDish(position);
		}
	}

	function handleDroppedOut(event) {
		var $draggable = $(this),
			incubator = Globals.lab.get('incubator'),
			position = $draggable.data('position');

		if($draggable.hasClass('testtube')) {
			incubator.addTestTubeAtPos($draggable.data('content'), position);
			$draggable.html('<img src="img/incubator_tube' + (position + 1) + '.png" alt="Test tube" />');
		}

		if($draggable.hasClass('petridish')) {
			incubator.addPetridishAtPos($draggable.data('content'), position);
			$draggable.html('<img src="img/incubator_dish' + (position + 1) + '.png" alt="Petridish" />');
		}
	}
});
