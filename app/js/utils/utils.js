define([
    'knockout',
    'lodash',
    'mapping',
    'model/type/Liquid'
], function (ko, _, mapping, LiquidType) {
    return {
        // Clone a knockout object by making it a plain object and
        // mapping it back to observables
        klone: function (obj) {
            return mapping.fromJS(ko.toJS(obj));
        },

        biology: {
            dilute: function(factor, liquids) {
                var clone = mapping.fromJS(ko.toJS(liquids()));

                _.map(clone(), function(liquid) {
                    if(liquid.type() === LiquidType.MICROORGANISM) {//TODO: dilute by factor if organism
                        console.log('Concentration before: ' + liquid.concentration());
                        liquid.concentration(liquid.concentration() / factor);
                        console.log('Concentration after: ' + liquid.concentration());
                    }

                    return liquid;
                });

                return clone;
            }
        },

        math: {
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
