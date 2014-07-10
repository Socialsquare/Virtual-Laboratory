/**
 * Model that defines a microorganism.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
], function(_) {

	var defaults = {
		living: true,
		name: '',
		extraDNA: null,
		/*{
			pcs: array of DNAElements of type 3, ie proteine coding sequences,
			promoterName: string name of the promoter the extra DNA comes from
		}*/
		extraProperties: null,
		optimalPh: 0,
		maxpH: 0,
		minpH: 0,
		optimalTemp: 0,
		minTemp: 0,
		maxTemp: 0,
		logConcentration: 0 //Defines the concentration of microorganisms, ie how many cells per ml
	};
	
	function Microorganism(options) {
		defaults.extraDNA = [];
		defaults.extraProperties = [];
		if(typeof options == 'string' || options instanceof String) {
			_.extend(this, defaults);
			this.name = options;
		}

		if(typeof options == 'object') {
			_.extend(this, defaults, options);
		}
	}

	Microorganism.prototype = {
		addDNA: addDNA,
		addExtraProperty: addExtraProperty,
		toString: toString,
		equals: equals,
		hasSameExtraDNA: hasSameExtraDNA,
		hasSameExtraPropertiesAs: hasSameExtraPropertiesAs,
		clone: clone,
		die: die
	};
	
	return Microorganism;

	/**
	 * @param gene: Array of DNAElements
	 */
	function addDNA(gene) {
		this.extraDNA.push(gene);
	}

	/**
	 * @param property: {
	 *		pcs: DNAElement, //Proteine coding sequence
	 *		promoterName: String
	 *	}
	 */
	function addExtraProperty(property) {
		this.extraProperties.push(property);
	}

	function toString() {
		return this.name;
	}

	function equals(microorganism) {
		return (this.living === microorganism.living && 
				this.hasSameExtraDNA(microorganism) && 
				this.hasSameExtraPropertiesAs(microorganism) &&
				this.optimalPh === microorganism.optimalPh &&
				this.maxpH === microorganism.maxpH &&
				this.minpH === microorganism.minpH &&
				this.optimalTemp === microorganism.optimalTemp &&
				this.minTemp === microorganism.minTemp &&
				this.maxTemp === microorganism.maxTemp);
	}

	function hasSameExtraDNA(microorganism) {
		var same = true,
			i = 0;
		while(same === true && i < this.extraDNA.length) {
			if(!this.extraDNA[i].equals(microorganism.extraDNA[i])) {
				same = false;
			}
			i++;
		}
		return same;
	}

	function hasSameExtraPropertiesAs(microorganism) {
		var same = true,
			samePCS = true,
			i = 0,
			j, thisPCS, microorganismPCS;
		while(same === true && samePCS === true && i < this.extraProperties.length) {
			if(this.extraProperties[i].promoterName !== microorganism.extraProperties[i].promoterName) {
				same = false;
			}
			else {
				j = 0;
				thisPCS = this.extraProperties[i].pcs;
				microorganismPCS = microorganism.extraProperties[i].pcs;
				while(samePCS === true && j < thisPCS.length) {
					if(!thisPCS[j].equals(microorganismPCS[j])) {
						samePCS = false;
					}
					j++;
				}
			}
			i++;
		}
		return same;
	}

	function clone() {
		var extraDNA = [],
			extraProperties = [],
			cloned, i;

		for(i = 0; i < this.extraDNA.length; i++) {
			extraDNA.push(this.extraDNA[i].clone());
		}

		for(i = 0; i < this.extraProperties.length; i++) {
			extraProperties.push({
				pcs: this.extraProperties[i].pcs.clone(),
				promoterName: this.extraProperties[i].promoterName
			});
		}

		cloned = new Microorganism({
			living: this.living,
			name: this.name,
			extraDNA: extraDNA,
			extraProperties: extraProperties,
			optimalpH: this.optimalPh,
			maxpH: this.maxpH,
			minpH: this.minpH,
			optimalTemp: this.optimalTemp,
			minTemp: this.minTemp,
			maxTemp: this.maxTemp,
			logConcentration: this.logConcentration
		});

		return cloned;
	}

	function die() {
		this.living = false;
	}
});
