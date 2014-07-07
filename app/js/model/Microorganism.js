/**
 * Model that defines a microorganism.
 * @author: Chris Hjorth, www.chrishjorth.com
 */

define([
    'base',
	'lodash',
], function(_) {

    var Microorganism = Base.extend({
        constructor: function (vals) {
            this.living = vals.living || true;
		    this.name = vals.name || '';
		    this.extraDNA = vals.extraDNA || null;
            /*{
			 pcs: array of DNAElements of type 3, ie proteine coding sequences,
			 promoterName: string name of the promoter the extra DNA comes from
		     }*/
		    this.extraProperties = vals.extraProperties || null;
		    this.optimalpH = vals.optimalpH || 0;
		    this.maxpH = vals.maxpH || 0;
		    this.minpH = vals.minpH || 0;
		    this.optimalTemp = vals.optimalTemp || 0;
		    this.minTemp = vals.minTemp || 0;
		    this.maxTemp = vals.maxTemp || 0;
            //Defines the concentration of microorganisms, ie how many cells per ml
		    this.logConcentration = vals.logConcentration ||  0;
        },

        addDNA: addDNA,
		addExtraProperty: addExtraProperty,
		toString: toString,
		equals: equals,
		hasSameExtraDNA: hasSameExtraDNA,
		hasSameExtraPropertiesAs: hasSameExtraPropertiesAs,
		clone: clone,
		die: die
    });

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
				this.optimalpH === microorganism.optimalpH &&
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
			optimalpH: this.optimalpH,
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
