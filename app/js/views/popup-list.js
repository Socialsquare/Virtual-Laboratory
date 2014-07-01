/**
 * Backbone view controller for a popup that shows a list of items that can be dragged.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'chcdraggable',
	'chcdraggablespawner',
	'globals',
	'text!../../templates/popup-list.html'
], function($, _, Backbone, chcDraggable, chcDraggableSpawner, Globals, popupListViewTemplate) {
	var popupView = Backbone.View.extend({
		el: $('#popup-container'),
		template: _.template(popupListViewTemplate),
		title: '',
		initialize: function(options) {
			this.title = options.title;
			this.listItems = options.listItems;
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
			var variables = {
				title: this.title
			};
			this.$el.html(this.template(variables));
			var html = '';
			for(var i = 0; i < this.listItems.length; i++) {
				html += '<li><div class="draggablespawner ' + this.listItems[i].identifierClass + '" data-item-index="' + i + '">' + this.listItems[i].name + '</div></li>';
			}
			$('.popup-list ul').html(html);
		},
		bindEvents: function() {
			$('body').on('click', '.popup-cancel-btn', this, handleClose);
			var view = this;
			$('.popup-list .draggablespawner').each(function() {
				var $this = $(this);
				var listItemIndex = $this.data('itemIndex');
				$this.chcDraggableSpawner({
					styleClass: 'draggablespawn-popuplist',
					spawnHTML: '<img src="img/' + view.listItems[listItemIndex].dragImg + '" />',
					content: view.listItems[listItemIndex].content
				});
			});
		},
		unbindEvents: function() {
			$('body').off('click', '.popup-cancel-btn', handleClose);
		},
		show: function() {
			this.render();
			$('#popup-container').show();
		},
		dismiss: function() {
			$('#popup-container').hide();
			this.unbindEvents();
		}
	});
	
	return popupView;
	
	/* !EVENT HANDLERS */
	function handleClose(event) {
		event.preventDefault();
		event.data.dismiss();
	}

	function handleListItemDroppedOut(event) {
		var $this = $(this);
		var listItemIndex = $this.data('itemIndex');
		if(event.data.listItems[listItemIndex].dragImg) {
			$this.html(event.data.listItems[listItemIndex].name);
		}
	}
});