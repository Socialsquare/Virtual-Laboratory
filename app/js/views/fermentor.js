/**
 * Backbone view controller for the fermentor view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/fermentor.html',
	'views/popup-ok',
], function($, _, Backbone, Globals, fermentorViewTemplate, popupOKView) {
	var fermentorView = Backbone.View.extend({
		template: _.template(fermentorViewTemplate),
		popupOKView: new popupOKView(),
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
				title: 'Fermentoren'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);
		},
		bindEvents: function() {
			$('#fermentor', this.$el).chcDroppable();
			this.$el.on('chcDroppableDrop.chcEvent', '#fermentor', this, handleDrop);
		},
		unbindEvents: function() {
			this.$el.off('chcDroppableDrop.chcEvent', '#fermentor', handleDrop);
			$('#fermentor', this.$el).chcDroppable('destroy');
		}
	});
	
	return fermentorView;
	
	/* !EVENT HANDLERS */
	function handleDrop(event, $draggable) {
		var $droppable = $(this),
			view = event.data,
			fermentor, content;

		console.log('HANDLE DROP');

		event.stopPropagation();
		event.preventDefault();

		if($draggable.hasClass('needle')) {
			content = $draggable.data('content');
			console.log('content');
			console.log(content);
			if(content) {
				console.log('Add to fermentor');
				fermentor = Globals.lab.get('fermentor');
				fermentor.addContent(content);
				$draggable.chcDraggable('destroy');
				$draggable.remove();
				return;
			}
			else {
				view.popupOKView.show('Kan ikke udføres', 'Der er ingen indhold i kanylen.');
			}
		}
		console.log('return to original position');

		$draggable.chcDraggable('returnToOriginalPosition');
	}
});
