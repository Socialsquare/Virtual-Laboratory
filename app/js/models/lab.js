/**
 * Backbone model that defines a lab. The state of all models referred to by this model defines the state of the game.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'backbone',
	'models/mouse',
	'models/worktable1',
	'models/incubator',
	'models/fermentor',
	'models/worktable2'
], function(_, Backbone, Mouse, Worktable1, Incubator, Fermentor, Worktable2) {
	var model = Backbone.Model.extend({
		defaults: {
			id: null,
			mouse: new Mouse(),
			currentExperiment: null,
			worktable1: new Worktable1(),
			pipette: {
				enabled: false,
				tip: false,
				content: null,
				dirty: false //true after has been filled and until a new tip is used
			},
			incubator: new Incubator(),
			fermentor: new Fermentor(),
			worktable2: new Worktable2()
		},
		fillPipette: fillPipette,
		emptyPipette: emptyPipette,
		isPipetteFull: isPipetteFull,
		hasPipetteTip: hasPipetteTip
	});
	
	return model;

	function fillPipette(content) {
		if(this.attributes.pipette.tip && this.attributes.pipette.content === null) {
			this.attributes.pipette.content = content;
			$('#pipette').addClass('full');
			console.log('Filled pipette with: ');
			console.log(this.attributes.pipette.content);
			return true;
		}
		return false;
	}

	function emptyPipette(receivingContainer) {
		var pipette = this.attributes.pipette,
			content;

		if(!pipette.tip) {
			return null;
		}

		content = pipette.content;
		switch(receivingContainer) {
			case 'petridish':
				content.decreaseConcentration(1.7);
				break;
			case 'tube':
				content.decreaseConcentration(1.7);
				break;
			case 'electroporator':
				content.decreaseConcentration(1);
				break;
		}

		$('#pipette').removeClass('full');
		console.log('Emptied from pipette: ');
		console.log(pipette.content);
		
		pipette.content = null;
		return content;
	}

	function isPipetteFull() {
		return (this.attributes.pipette.content !== null);
	}

	function hasPipetteTip() {
		return this.attributes.pipette.tip;
	}
});