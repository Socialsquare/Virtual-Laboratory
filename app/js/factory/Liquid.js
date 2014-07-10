define([
    'knockout',
    'model/Liquid',
    'model/ReactionCount',
    'model/Microorganism',
    'model/Antibiotic',
    'model/MicroorganismType',
    'model/AntibioticType'
], function (ko, Liquid, ReactionCount, Microorganism, Antibiotic, MicroorganismType, AntibioticType) {

    var LiquidFactory = {
        microorganism: {
            yeast: function () {
                var micro = new Microorganism(MicroorganismType.YEAST);

                // TODO: temp values
                micro.living(true);
		        micro.extraGenes([]);
                micro.extraProperties([]);
                micro.optimalPh(6.0);
		        micro.optimalTemp(35);
                //TODO: patty: log eller ikke log?
		        micro.concentration(5);


                return micro;
            },

            myeloma: function () {
                var micro = new Microorganism(MicroorganismType.MYELOMA);

                // TODO: temp values
                micro.living(true);
		        micro.extraGenes([]);
                micro.extraProperties([]);
		        micro.optimalPh(7.25); // http://en.wikipedia.org/wiki/Blood#Narrow_range_of_pH_values
		        micro.optimalTemp(37);
		        micro.concentration(0);

                return micro;
            }
        },

        antibiotic: {
            a: function () {
                var anti = new Antibiotic(AntibioticType.A);

                // TODO: temp values

                return anti;
            }
        },

        growthMedium: function () {
            return new Liquid(LiquidType.GROWTH_MEDIUM, ReactionCount.NEVER);
        }
    };

    return LiquidFactory;
});
