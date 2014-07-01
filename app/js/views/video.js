/**
 * Backbone view controller for the video view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'collections/videos'
], function($, _, Backbone, Globals, Videos) {
	var view = Backbone.View.extend({
		template: null,
		el: $('#video-container'),
		collection: new Videos(),
		initialize: function(options) {
			var view = this;
			this.collection.fetch({
				success: function(collection, response, options) {
					view.preload();
				},
				error: function(collection, response, options) {
					console.log('Error fetching videos:');
					console.log(response);
				}
			});
		},
		preload: function() {
			var view = this;
			var videoIDs = [];
			this.collection.each(function(video) {
				if(video.get('id') !== 'VIDEO_NONE') {
					view.$el.append('<video id="' + video.get('id') + '" class="offscreen" preload="auto" ><source src="videos/' + video.get('file') + '.mp4" type="video/mp4" /><source src="videos/' + video.get('file') + '.webm" type="video/webm" /></video>');
					videoIDs.push(video.get('id'));
				}
			});

			$('#video-container').css({'display': 'block'});
			loadVideos(videoIDs, 0);
		},
		close: function() {
			this.$el.empty();
		},
		play: function(video_id) {
			var $video = $('#' + video_id);
			var video = $video.get(0);
			$('#video-container').css({'display': 'block'});
			//setTimeout(function() {
				$video.removeClass('offscreen');
				video.play();
				$video.on('ended', null, video_id, handleVideoEnd);
			//}, 1);
		}
	});
	
	return view;
	
	/**
	 * Chain loads the videos recursively.
	 */
	function loadVideos(videoIDs, currentID) {
		if(videoIDs.length <= 0 || currentID >= videoIDs.length) {
			$('#video-container').css({'display': 'none'});
			console.log('No more task videos to load.');
			return;
		}

		var videoElement = $('#' + videoIDs[currentID]);
		var video = videoElement.get(0);
		videoElement.one('loadeddata', function() {
			console.log('Loaded: ' + videoIDs[currentID]);
			loadVideos(videoIDs, ++currentID);
		});
		videoElement.load();
	}

	/* !EVENT HANDLERS */

	function handleVideoEnd(event) {
		$('#video-container').css({'display': 'none'});
		var $video = $('#' + event.data);
		var video = $video.get(0);
		video.pause();
		video.currentTime = '0';
		$video.off('ended', handleVideoEnd);
		$video.addClass('offscreen');
	}
});