/**
 * Backbone view controller for a popup that allows the user to select from a list of available lab tasks.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'collections/experiments',
	'text!../../templates/popup-selectexperiment.html'
], function($, _, Backbone, Globals, Experiments, popupSelectExperimentViewTemplate) {
	var popupView = Backbone.View.extend({
		el: $('#popup-container'),
		template: _.template(popupSelectExperimentViewTemplate),
		initialize: function() {
			this.collection = new Experiments();
			var view = this;
			this.collection.on('add', function() {
				view.renderExperiments();
			});
			/*this.collection.on('change', function(model) {
				console.log('model changed');
				console.log(model);
			});*/
		},
		close: function() {
			this.unbindEvents();
			this.$el.html('');
		},
		render: function() {
			this.renderTemplate();
			
			var experiments = this.collection;
			experiments.fetch(/*{
				success: function(collection, response, options) {
					console.log('Experiment fetch success');
				},
				error: function(collection, response, options) {
					console.log('Experiment fetch error');
				}
			}*/);
			
			this.bindEvents();
			return this;
		},
		renderTemplate: function() {
			var variables = {
				title: 'Opgaver',
				description: 'Velkommen til det virtuelle laboratorium. I laboratoriet kan der udføres genteknologiske forsøg, der i meget høj grad udføres på samme måde i virkeligheden. I enkelte tilfælde afviger dog fra de regler der gælder for genteknologiske laboratorier - læs mere <a href="http://www.biotechacademy.dk/undervisningsprojekter/genteknologi/virtuelt%20laboratorium/uddybende%20information%20om%20laboratoriet%20og%20procedurer.aspx">her</a>.'
			};
			this.$el.html(this.template(variables));

			this.renderExperiments();
		},
		renderExperiments: function() {
			var $experimentList = this.$el.find('.popup .chc-select');
			$experimentList.empty();
			this.collection.each(function(experiment) {
				$experimentList.append('<a href="" data-value="' + experiment.get('id') + '"><div>' + experiment.get('title') + '</div></a>');
			});
		},
		bindEvents: function() {
			$('body').on('click', '.popup .chc-select a', this, handleSelect);
			$('body').on('submit', '.popup form', this, handleSubmit);
			$('body').on('click', '#popup-cancel-btn', this, handleCancel);
		},
		unbindEvents: function() {
			$('body').off('click', '.popup .chc-select a', handleSelect);
			$('body').off('submit', '.popup form', handleSubmit);
			$('body').off('click', '#popup-cancel-btn', handleCancel);
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
	function handleSelect(event) {
		event.preventDefault();
		$('.popup .chc-select a').removeClass('selected');
		var $this = $(this);
		$this.addClass('selected');
		var experimentID = $this.data('value');
		var experiment = event.data.collection.get(experimentID);
		$('.popup .description').html(experiment.get('description'));
	}
	
	function handleSubmit(event) {
		event.preventDefault();
		var $experiment = $('.popup .chc-select .selected');
		if($experiment.length != 1) {
			alert('Du har ikke valgt nogen opgave endnu.');
			return;
		}
		var experimentID = $experiment.data('value');
		Globals.lab.set({'currentExperiment': event.data.collection.get(experimentID)});
		event.data.dismiss();
	}
	
	function handleCancel(event) {
		event.preventDefault();
		event.data.dismiss();
	}
});