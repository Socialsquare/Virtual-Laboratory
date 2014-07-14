define([
    'knockout',
    'model/Liquid',
    'model/ReactionCount',
    'model/Microorganism',
    'model/Antibiotic',
    'model/HomogenizedSpleen',
    'model/type/Microorganism',
    'model/type/Antibiotic',
    'model/type/Liquid'

], function (ko, Liquid, ReactionCount, Microorganism, Antibiotic, HomogenizedSpleen,
             MicroorganismType, AntibioticType, LiquidType) {

    var LiquidFactory = {
        microorganism: {
            yeast: function () {
                var micro = new Microorganism(MicroorganismType.YEAST);

                micro.living(true);
                micro.extraGenes([]);
                micro.extraProperties([]);
                micro.optimalPh(6.0);
                micro.optimalTemp(35);
                micro.concentration(Math.pow(10, 3));


                return micro;
            },

            myeloma: function () {
                var micro = new Microorganism(MicroorganismType.MYELOMA);

                micro.living(true);
                micro.extraGenes([]);
                micro.extraProperties([]);
                micro.optimalPh(7.25); // http://en.wikipedia.org/wiki/Blood#Narrow_range_of_pH_values
                micro.optimalTemp(37);
                micro.concentration(Math.pow(10, 3));

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

        homoSpleen: function(antibodies) {
            var homogenizedSpleen = new HomogenizedSpleen();
            homogenizedSpleen.antibodiesFor.pushAll(antibodies);
            return homogenizedSpleen;
        },

        growthMedium: function () {
            return new Liquid(LiquidType.GROWTH_MEDIUM, ReactionCount.NEVER);
        },

        deadly: function () {
            return new Liquid(LiquidType.DEADLY, ReactionCount.ALWAYS);
        },

        insulin: function () {
            return new Liquid(LiquidType.INSULIN, ReactionCount.NEVER);
        },

        antigen_gout: function () {

            return new Liquid(LiquidType.ANTIGEN_GOUT, ReactionCount.NEVER);
        },

        antigen_smallpox: function () {
            return new Liquid(LiquidType.ANTIGEN_SMALLPOX, ReactionCount.NEVER);
        },

        adjuvans: function () {
            return new Liquid(LiquidType.ADJUVANS, ReactionCount.NEVER);
        }
    };

    return LiquidFactory;
});
