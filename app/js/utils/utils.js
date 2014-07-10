define([
    'knockout',
    'mapping'
], function (ko, mapping) {
    return {
        // Clone a knockout object by making it a plain object and
        // mapping it back to observables
        klone: function (obj) {
            return mapping.fromJS(ko.toJS(obj));
        },

        math: {
	        /*getBiomassFromLogConcentration: function(logConcentration) {
		        return Math.pow(10, logConcentration - 12);
	        },

	        getLogConcentrationFromBiomass: function (biomass) {
		        return this.getBaseLog(10, biomass) + 12;
	        },*/

	        getBaseLog: function (base, num) {
		        return Math.log(num) / Math.log(base);
	        },

            getBiomassFromConcentration: function(concentration){ //Converts from concentration to biomass (g/L)
                return concentration / Math.pow(10, 12);
            },

            getConcentrationFromBiomass: function(biomass){
                return biomass * Math.pow(10, 12);
            }
        },

        formatter: {
            leadingZeros: function(number, size) {
                var s = number+"";
                while (s.length < size) s = "0" + s;
                return s;
            }
        }
    };
});
