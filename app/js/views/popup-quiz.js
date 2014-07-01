/**
 * Backbone view controller for a popup that presents the user with a quiz.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/popup-quiz.html'
], function($, _, Backbone, Globals, popupQuizViewTemplate) {
	var popupView = Backbone.View.extend({
		el: $('#popup-container'),
		template: _.template(popupQuizViewTemplate),
		question: '',
		answer1: '',
		answer1explanation: '',
		answer2: '',
		answer2explanation: '',
		answer3: '',
		answer3explanation: '',
		correct_answer: null,
		initialize: function() {
			
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
				title: 'Quiz',
				question: this.question,
				answer1: this.answer1,
				answer2: this.answer2,
				answer3: this.answer3
			};
			this.$el.html(this.template(variables));
		},
		bindEvents: function() {
			$('body').on('click', 'input[type="radio"]', this, handleRadioClick);
			$('body').on('click', '#popup-ok-btn', this, handleOK);
		},
		unbindEvents: function() {
			$('body').off('click', 'input[type="radio"]', handleRadioClick);
			$('body').off('click', '#popup-ok-btn', handleOK);
		},
		show: function(quiz) {
			this.question = quiz.question;
			this.answer1 = quiz.answer1;
			this.answer1explanation = quiz.answer1explanation;
			this.answer2 = quiz.answer2;
			this.answer2explanation = quiz.answer2explanation;
			this.answer3 = quiz.answer3;
			this.answer3explanation = quiz.answer3explanation;
			this.correct_answer = quiz.correct_answer;
			this.render();
			$('#popup-container').show();
		},
		dismiss: function() {
			$('#popup-container').hide();
		}
	});
	
	return popupView;
	
	/* !EVENT HANDLERS */
	function handleRadioClick(event) {
		var $this = $(this);
		var forID = $this.attr('id');
				
		$('.popup-quiz input[type="radio"] + label').html('');
		$('.popup-quiz input[type="radio"] + label[for="' + forID + '"]').html('x');
				
		var answerNum = $('input[name="answer"]:checked').val();

		var answerText = '';
		switch(answerNum) {
			case '1':
				answerText = event.data.answer1explanation;
				break;
			case '2':
				answerText = event.data.answer2explanation;
				break;
			case '3':
				answerText = event.data.answer3explanation;
				break;
		}

		$('#quiz-answer p').html(answerText);
		$('#quiz-answer').removeClass('hidden');
	}
	
	function handleOK(event) {
		event.data.dismiss();
	}
});