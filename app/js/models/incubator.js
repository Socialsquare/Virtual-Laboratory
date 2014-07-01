/**
 * Backbone model that keeps state for incubator.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'backbone',
	'models/microorganism',
	'lab-math'],
function(_, Backbone, Microorganism, LabMath) {
	var maxTestTubeNum = 6,
		maxPetridishes = 6,
		timeStep = 1,
		tempStep = 1,
		dt = 0.25; //1/4 hour

	var model = Backbone.Model.extend({
		/**
		 * Container contents: {
		 *		dna: [],
		 *		microorganisms: []
		 *	}
		 */
		defaults: {
			id: null,
			state: false, //false = OFF, true = ON
			testTubes: new Array(maxTestTubeNum),
			petridishes: new Array(maxPetridishes),
			time: 48, //hours, they will be mapped to seconds
			temperature: 30 //C
		},
		initialize: function(option) {
			var i;
			for(i = 0; i < this.attributes.testTubes.length; i++) {
				this.attributes.testTubes[i] = null;
			}
			for(i = 0; i < this.attributes.petridishes.length; i++) {
				this.attributes.petridishes[i] = null;
			}
			
		},
		toggle: toggle,
		timeUp: timeUp,
		timeDown: timeDown,
		tempUp: tempUp,
		tempDown: tempDown,
		run: run,
		isTubeSlotEmpty: isTubeSlotEmpty,
		addTestTubeAtPos: addTestTubeAtPos,
		removeTube: removeTube,
		isDishSlotEmpty: isDishSlotEmpty,
		addPetridishAtPos: addPetridishAtPos,
		removeDish: removeDish,
		grow: grow,
		growMicroorganism: growMicroorganism,
		getFTemp: getFTemp
	});
	
	return model;

	function toggle(callback) {
		var model = this;
		model.attributes.state = !model.attributes.state;
		if(model.attributes.state) {
			model.run(model, function() {
				model.attributes.state = false;
				callback();
			});
		}
	}

	function timeUp() {
		this.attributes.time += timeStep;
	}

	function timeDown() {
		this.attributes.time -= timeStep;
		if(this.attributes.time < 0) {
			this.attributes.time = 0;
		}
	}

	function tempUp() {
		this.attributes.temperature += tempStep;
	}

	function tempDown() {
		this.attributes.temperature -= tempStep;
		if(this.attributes.temperature < 0) {
			this.attributes.temperature = 0;
		}
	}

	function run(model, callback) {
		var i;
		if(model.attributes.time <= 0 || !model.attributes.state) {
			//Done running
			callback();
			return;
		}

		for(i = 0.0; i < timeStep; i += dt) {
			model.grow();
		}

		setTimeout(function() {
			model.attributes.time--;
			run(model, callback);
		}, 1000);
	}

	function isTubeSlotEmpty(position) {
		return (this.attributes.testTubes[position] === null);
	}

	function addTestTubeAtPos(content, position) {
		this.attributes.testTubes[position] = content;
	}

	function removeTube(position) {
		this.attributes.testTubes[position] = null;
	}

	function isDishSlotEmpty(position) {
		return (this.attributes.petridishes[position] === null);
	}

	function addPetridishAtPos(content, position) {
		this.attributes.petridishes[position] = content;
	}

	function removeDish(position) {
		this.attributes.petridishes[position] = null;
	}

	function grow() {
		var i, j, container, containerContent, totalBiomass;
		for(i = 0; i < this.attributes.testTubes.length; i++) {
			container = this.attributes.testTubes[i];
			if(container !== null) {
				containerContent = container.getContent();
				totalBiomass = containerContent.getTotalBiomass();
				for(j = 0; j < containerContent.microorganisms.length; j++) {
					this.growMicroorganism(container, containerContent.microorganisms[j], totalBiomass);
				}
				containerContent.updateTotalLogConcentration();
			}
		}

		for(i = 0; i < this.attributes.petridishes.length; i++) {
			container = this.attributes.petridishes[i];
			if(container !== null) {
				containerContent = container.getContent();
				totalBiomass = containerContent.getTotalBiomass();
				for(j = 0; j < containerContent.microorganisms.length; j++) {
					this.growMicroorganism(container, containerContent.microorganisms[j], totalBiomass);
				}
				containerContent.updateTotalLogConcentration();
			}
		}
	}

	function growMicroorganism(container, microorganism, totalBiomass) {
		var increase = 0,
			biomass, growthCoefficient;

		console.log('GROW STEP');
		console.log('logConcentration before: ' + microorganism.logConcentration);

		if(microorganism.living === false) {
			console.log('Microorganism cannot grow because it is dead.');
			return;
		}

		biomass = LabMath.getBiomassFromLogConcentration(microorganism.logConcentration);
		console.log('biomass start: ' + biomass);
		if(biomass < container.maxBiomass) {
			growthCoefficient = this.getFTemp(microorganism) * 0.6;
			increase = (growthCoefficient * biomass * (container.maxBiomass - totalBiomass)) / container.maxBiomass * dt;
			console.log('increase: ' + increase);
		}
		biomass += increase;
		microorganism.logConcentration = LabMath.getLogConcentrationFromBiomass(biomass);
		if(microorganism.logConcentration > container.maxConcentration) {
			microorganism.logConcentration = container.maxConcentration;
		}
		console.log('biomass after: ' + biomass);
		console.log('logConcentration after: ' + microorganism.logConcentration);
	}

	function getFTemp(microorganism) {
		var tempDiff = this.attributes.temperature - microorganism.optimalTemp;
		if(tempDiff > 0) {
			if(tempDiff > 8) {
				microorganism.living = false;
				return 0;
			}

			return -1 / 64 * Math.pow(tempDiff, 2) + 1;
		}
		if(tempDiff < 0) {
			if(tempDiff < -20) {
				return 0;
			}
			return 1 / 20 * tempDiff + 1;
		}
		
		return 1; //tempDiff === 0
	}
});
