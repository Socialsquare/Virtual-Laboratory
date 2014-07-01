/**
 * Backbone view controller for the menu view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'chcdraggable',
	'chcdroppable',
	'globals',
	'text!../../templates/menu.html',
	'views/popup-taskchecklist'
], function($, _, Backbone, chcDraggable, chcDroppable, Globals, menuViewTemplate, popupTaskChecklist) {
	var menuView = Backbone.View.extend({
		el: '#menu',
		template: _.template(menuViewTemplate),
		popupTaskChecklist: null,
		initialize: function(options) {
		},
		close: function() {
			this.unbindEvents();
			this.$el.html('');
		},
		render: function() {
			this.renderTemplate();
			this.bindEvents();
			return this;
		},
		renderTemplate: function() {
			this.$el.html(this.template());
		},
		bindEvents: function() {
			$('body').on('click', '#menu-experimentinstructions-link', this, showExperimentInstructions);
			
			$('.inventory .draggable').chcDraggable();
			
			$('.inventory').chcDroppable();
			$('.inventory').on('chcDroppableDrop.chcEvent', null, this, handleDrop);

			$('body').on('click', '#menu-pipette-btn', this, handlePipette);
			$('body').on('click', '#menu-tips-btn', this, handleTips);
			$('body').on('click', '#menu-trash-btn', this, handleTrash);
		},
		unbindEvents: function() {
			$('body').off('click', '#menu-experimentinstructions-link', showExperimentInstructions);
			$('.inventory .draggable').chcDraggable('destroy');
			$('.inventory').off('chcDroppableDrop.chcEvent', null, handleDrop);
			$('.inventory').chcDroppable('destroy');

			$('body').off('click', '#menu-pipette-btn', handlePipette);
			$('body').off('click', '#menu-tips-btn', handleTips);
			$('body').off('click', '#menu-trash-btn', handleTrash);
		},
		/**
		 * @assertion: $item is not yet a draggable
		 */
		addItemToInventory: function($item) {
			//Find first empty list item, if not append one
			var $emptySlot = [];
			var $inventory = $('.inventory ul', this.$el);
			$('.menu-inventory-box', $inventory).each(function() {
				var $this = $(this);
				if($this.html() === '') {
					$emptySlot = $this;
					return false; //Break the jQuery each
				}
			});
			$item.css({
				'position': 'relative',
				'top': 0,
				'left': 0,
				'z-index': 10
			});
			if($emptySlot.length > 0) {
				$emptySlot.append($item);
			}
			else {
				var $newInventoryItem = $('<li class="menu-inventory-box"></li>');
				$newInventoryItem.append($item);
				$inventory.append($newInventoryItem);
			}
			$item.chcDraggable();
		}
	});
	
	return menuView;
	
	/* !EVENT HANDLERS */
	
	function showExperimentInstructions(event) {
		event.preventDefault();
		var currentExperiment = Globals.lab.get('currentExperiment');
		if(currentExperiment === null) {
			alert('Du skal først vælge en opgave at arbejde med.');
			return;
		}
		
		if(event.data.popupTaskChecklist === null) {
			event.data.popupTaskChecklist = new popupTaskChecklist({currentExperiment: currentExperiment});
		}
		event.data.popupTaskChecklist.show();
	}

	function handleDrop(event, $draggable) {
		//Sanitize draggable
		$draggable.off();
		$draggable.chcDraggable('destroy');
		event.data.addItemToInventory($draggable);
	}

	function handlePipette(event) {
		var pipette = Globals.lab.get('pipette'),
			$pipette;
		if(pipette.enabled) {
			$pipette = $('#pipette');
			$pipette.chcDraggable('destroy');
			$pipette.remove();
			pipette.tip = false;
			pipette.dirty = false;
			pipette.enabled = false;
		}
		else {
			$('body').append('<div class="pipette draggable" id="pipette"></div>');
			$pipette = $('#pipette');
			$pipette.chcDraggable({returnToOriginalPosition: false});
			pipette.enabled = true;
		}
	}

	function handleTips(event) {
		var pipette = Globals.lab.get('pipette');
		//If in pipette mode and no tip, add tip, else do nothing
		if(pipette.enabled && !pipette.tip) {
			var $pipette = $('#pipette');
			$pipette.addClass('tip');
			pipette.tip = true;
			pipette.dirty = false;
		}
	}

	function handleTrash(event) {
		//If in pipette mode and tip, remove tip
		var pipette = Globals.lab.get('pipette');
		if(pipette.enabled && pipette.tip) {
			var $pipette = $('#pipette');
			$pipette.removeClass('tip');
			$pipette.removeClass('full');
			pipette.tip = false;
		}
	}
});