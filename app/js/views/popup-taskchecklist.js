/**
 * Backbone view controller for a popup that allows the user to view the instructions for a task as well as the progress.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'models/experiment',
	'text!../../templates/popup-taskchecklist.html'
], function($, _, Backbone, Globals, Experiment, popupTaskCheckListViewTemplate) {
	var popupView = Backbone.View.extend({
		el: $('#popup-container'),
		template: _.template(popupTaskCheckListViewTemplate),
		initialize: function() {
			this.experiment = Globals.lab.get('currentExperiment');
			this.experiment.on('change', function() {
				console.log('UPDATED');
				this.renderTaskList();
			}, this);
			this.experiment.fetch(/*{
				success: function(collection, response, options) {
					console.log('Experiment fetch success');
					console.log(response);
					console.log(options);
				},
				error: function(collection, response, options) {
					console.log('Experiment fetch error');
				}
			}*/);
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
				title: this.experiment.get('title'),
				description: this.experiment.get('description')
			};
			this.$el.html(this.template(variables));

			this.renderTaskList();
		},
		renderTaskList: function() {
			var tasks = this.experiment.get('tasks');
			if(tasks !== null) {
				var $taskList = $('#taskchecklist-tasklist');
				tasks.each(function(task) {
					if(task.get('completed') === true) {
						$taskList.append('<li class="completed" data-task_id="' + task.get('id') + '">' + task.get('description') + '</li>');
					}
					else {
						$taskList.append('<li data-task_id="' + task.get('id') + '">' + task.get('description') + '</li>');
					}
				});
			}
		},
		bindEvents: function() {
			$('body').on('click', '.close-popup-link', this, handleClose);
			$('body').on('click', 'input[type="checkbox"]', handleCheckbox);
		},
		unbindEvents: function() {
			$('body').off('click', '.close-popup-link', handleClose);
			$('body').off('click', 'input[type="checkbox"]', handleCheckbox);
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
	
	function handleCheckbox(event) {
		var $this = $(this);
		var forID = $this.attr('id');
		if($this.is(':checked')) {
			$('.popup-taskchecklist input[type="checkbox"] + label[for="' + forID + '"]').html('x');
		}
		else {
			$('.popup-taskchecklist input[type="checkbox"] + label[for="' + forID + '"]').html('');
		}
	}
});