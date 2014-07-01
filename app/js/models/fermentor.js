/**
 * Backbone model that keeps state for fermentor.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'backbone',
	'models/microorganism',
	'lab-math'],
function(_, Backbone, Microorganism, LabMath) {

	var phStep = 0.1,
		tempStep = 0.1,
		timeStep = 1,
		maxTime = 60, //60 hours, mapped to seconds
		maxBiomass = 10.1,
		dt = 0.25; //1/4 hour

	var model = Backbone.Model.extend({
		defaults: {
			id: null,
			time: 0, //hours mapped to seconds
			ph: 7.0,
			temperature: 20, //C
			running: false,
			content: null,
			substrate: [],
			biomass: [],
			product: []
		},
		initialize: function(option) {
			
		},
		addContent: addContent,
		phUp: phUp,
		phDown: phDown,
		tempUp: tempUp,
		tempDown: tempDown,
		toggle: toggle,
		run: run,
		ferment: ferment,
		fermentMicroorganism: fermentMicroorganism,
		getFTemp: getFTemp,
		getGpH: getGpH
	});
	
	return model;

	function addContent(content) {
		this.attributes.content = content;
		console.log('Added content to fermentor');
		console.log(this.attributes.content);
	}

	function phUp() {
		this.attributes.ph += phStep;
	}

	function phDown() {
		this.attributes.ph -= phStep;
		if(this.attributes.ph < 0) {
			this.attributes.ph = 0;
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

	function toggle() {
		this.attributes.running = !this.attributes.running;
		if(this.attributes.running === true) {
			this.attributes.substrate = [];
			this.attributes.biomass = [];
			this.attributes.product = [];
			this.run();
		}
	}

	function run() {
		var model = this,
			i;
		if(model.attributes.running === true && model.attributes.time < maxTime) {
			model.attributes.time += timeStep;

			for(i = 0.0; i < timeStep; i += dt) {
				model.ferment();
			}

			setTimeout(function(event) {
				model.run();
			}, 1000);
		}
	}

	function ferment() {
		var content = this.attributes.content,
			product = 0,
			i, totalBiomass, microorganism, biomass;

		console.log('fermentor content');
		console.log(content);
		
		totalBiomass = content.getTotalBiomass();
		for(i = 0; i < content.microorganisms.length; i++) {
			microorganism = content.microorganisms[i];
			biomass = this.fermentMicroorganism(microorganism, totalBiomass);
			if(microorganism.extraProperties.length > 0) {
				product += biomass / 10 / microorganism.extraProperties.length;
			}
		}
		totalBiomass = content.getTotalBiomass();
		this.attributes.biomass.push(totalBiomass);
		this.attributes.substrate.push(20 - 2 * content.getTotalBiomass());
		this.attributes.product.push(product);
	}

	function fermentMicroorganism(microorganism, totalBiomass) {
		var increase = 0,
			biomass, growthCoefficient;

		console.log('FERMENTATION STEP');
		console.log('logConcentration before: ' + microorganism.logConcentration);

		if(microorganism.living === false) {
			console.log('Microorganism cannot fermentate because it is dead.');
			return;
		}

		biomass = LabMath.getBiomassFromLogConcentration(microorganism.logConcentration);
		console.log('biomass start: ' + biomass);
		if(biomass < maxBiomass) {
			growthCoefficient = this.getFTemp(microorganism) * this.getGpH(microorganism) * 0.6;
			increase = (growthCoefficient * biomass * (maxBiomass - totalBiomass)) / maxBiomass * dt;
			console.log('increase: ' + increase);
		}
		biomass += increase;
		console.log('biomass after: ' + biomass);
		microorganism.logConcentration = LabMath.getLogConcentrationFromBiomass(biomass);
		console.log('logConcentration after: ' + microorganism.logConcentration);
		return biomass;
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

	function getGpH(microorganism) {
		if(this.attributes.ph >= microorganism.optimalpH - 2 && this.attributes.ph <= microorganism.optimalpH + 2) {
			return -1 / 4 * Math.pow(this.attributes.ph - microorganism.optimalpH, 2) + 1;
		}
		else {
			microorganism.living = false;
			return 0;
		}
	}
});
