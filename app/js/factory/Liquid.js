define([
    'knockout',
    'model/Liquid',
    'model/ReactionCount',
    'model/Microorganism',
    'model/Myeloma',
    'model/Antibiotic',
    'model/HomogenizedSpleen',
    'model/SaltWater',
    'model/FluorescentSecondaryAntibody',

    'model/type/Microorganism',
    'model/type/Antibiotic',
    'model/type/Liquid'

], function (ko, Liquid, ReactionCount, Microorganism, MyelomaModel, Antibiotic,
             HomogenizedSpleen, SaltWater, FluorescentSecondaryAntibody, MicroorganismType, AntibioticType,
             LiquidType) {

    var LiquidFactory = {
        microorganism: {
            yeast: function () {
                var micro = new Microorganism(MicroorganismType.YEAST);

                micro.living(true);
                micro.extraGenes([]);
                micro.extraProperties([]);
                micro.optimalPh(6.0);
                micro.optimalTemp(35);
                micro.concentration(Math.pow(10, 8));


                return micro;
            },

            myeloma: function () {
                return new MyelomaModel();
            }
        },

        antibiotic: {
            a: function () {
                var anti = new Antibiotic(AntibioticType.A);

                return anti;
            },

            b: function () {
                var anti = new Antibiotic(AntibioticType.B);

                return anti;
            }
        },

        homoSpleen: function(antibody) {
            var homogenizedSpleen = new HomogenizedSpleen();

            homogenizedSpleen.antibodiesFor.push(antibody);
            return homogenizedSpleen;
        },

        hybridomaMedium: function () {
            return new Liquid(LiquidType.HYBRIDOMA_MEDIUM, ReactionCount.NEVER);
        },

        growthMedium: function () {
            return new Liquid(LiquidType.GROWTH_MEDIUM, ReactionCount.NEVER);
        },

        deadly: function () {
            return new Liquid(LiquidType.DEADLY, ReactionCount.ALWAYS);
        },

        fluorescentSecondaryAntibody: function () {
            return new FluorescentSecondaryAntibody();
        },

        insulin: function () {
            return new Liquid(LiquidType.INSULIN, ReactionCount.NEVER);
        },

        antigenGout: function () {
            return new Liquid(LiquidType.ANTIGEN_GOUT, ReactionCount.NEVER);
        },

        antigenSmallpox: function () {
            return new Liquid(LiquidType.ANTIGEN_SMALLPOX, ReactionCount.NEVER);
        },

        antibodySmallpox: function () {
            return new Liquid(LiquidType.ANTIBODY_SMALLPOX, ReactionCount.NEVER);
        },

        antibodyGout: function () {
            return new Liquid(LiquidType.ANTIBODY_GOUT, ReactionCount.NEVER);
        },

        adjuvans: function () {
            return new Liquid(LiquidType.ADJUVANS, ReactionCount.NEVER);
        },

        lipase: function () {
            return new Liquid(LiquidType.LIPASE_ENZYME, ReactionCount.NEVER);
        },

        gfp: function () {
            return new Liquid(LiquidType.GFP, ReactionCount.NEVER);
        },

        juice: function () {
            return new Liquid(LiquidType.JUICE, ReactionCount.ALWAYS);
        },

        saltWater: function () {
            return new SaltWater();
        },

        buffer: function() {
            return new Liquid(LiquidType.BUFFER, ReactionCount.NEVER);
        }
    };

    return LiquidFactory;
});
