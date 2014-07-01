/**
 * Backbone model that defines a lab task.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'backbone',
	'globals'
], function(_, Backbone, Globals) {
	var model = Backbone.Model.extend({
		urlRoot: Globals.API_URL + 'experiments', //This allows calling fetch on a single model, independent of the collection
		defaults: {
			id: null,
			description: '',
			instrument_id: null,
			action_id: null,
			inputs: [],
			outputs: [],
			video_id: null,
			question: '',
			answer1: '',
			answer1explanation: '',
			answer2: '',
			answer2explanation: '',
			answer3: '',
			answer3explanation: '',
			correct_answer: null,
			completed: false
		},
		parse: function(response) {
			return response;
		},
		initialize: function(attributes) {
			var taskEvent = 'task:' + attributes.instrument_id + ':' + attributes.action_id;
			console.log('register: ' + taskEvent);
			$(document.body).on(taskEvent, null, this, handleTask);
		}
	});
	
	return model;

	function handleTask(event) {
		if(event.data.get('completed') === true) {
			return;
		}
		
		event.data.set({'completed': true});

		if(!wasCompletedCorrectly(event.data) && event.data.get('question') !== '') {
			var quiz = {
				question: event.data.get('question'),
				answer1: event.data.get('answer1'),
				answer1explanation: event.data.get('answer1explanation'),
				answer2: event.data.get('answer2'),
				answer2explanation: event.data.get('answer2explanation'),
				answer3: event.data.get('answer3'),
				answer3explanation: event.data.get('answer3explanation'),
				correct_answer: event.data.get('correct_answer')
			};
			Globals.quiz.show(quiz);
		}

		/*var video_id = event.data.attributes.video_id;
		if(video_id && video_id !== null) {
			Globals.videos.play(video_id);
		}*/
	}

	function wasCompletedCorrectly(task) {
		return false;
	}
});