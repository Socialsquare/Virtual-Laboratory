define([
    'base',
    'lodash',

    'service/Localization',

    'model/type/Container',
    'model/type/SpecialItem',
    'model/type/Liquid'
], function (Base, _, localizationService, ContainerType, SpecialItemType, LiquidType) {
    var TextHelper = Base.extend({
        constructor: function () {
            var self = this;

            self.description = function (item) {
                switch (item.type()) {
                case SpecialItemType.SCALPEL:
                    return 'item.description.scalpel';
                case SpecialItemType.SPLEEN:
                    return 'item.description.spleen';

                case LiquidType.INSULIN:
                    return 'liquid.description.insulin';
                case LiquidType.LIPASE_ENZYME:
                    return 'liquid.description.lipase';
                case LiquidType.ANTIBODY_GOUT:
                    return 'liquid.description.antibody_gout';
                case LiquidType.ANTIBODY_SMALLPOX:
                    return 'liquid.description.antibody_smallpox';

                default:
                    throw 'Unknown inventory item: ' + item.type();
                }
            };

            self.label = function (container) {
                var contents = _.map(container.liquids(), _.compose(localizationService.text, self.prettyName));

                return localizationService.text('common.contains') + ': ' + contents.join(' and ');
            };

            self.prettyName = function (item) {
                return self.prettyNameFromType(item.type());
            };

            self.prettyNameFromType = function (type) {
                switch (type) {
                case ContainerType.PETRI_DISH:
                    return 'item.name.petri_dish';
                case ContainerType.MICROTITER:
                    return 'item.name.microtiter';
                case ContainerType.TUBE:
                    return 'item.name.tube';
                case ContainerType.SYRINGE:
                    return 'item.name.syringe';

                case SpecialItemType.SCALPEL:
                    return 'item.name.scalpel';
                case SpecialItemType.SPLEEN:
                    return 'item.name.spleen';

                case LiquidType.MICROORGANISM:
                    return 'liquid.name.microorganism';
                case LiquidType.ANTIBIOTIC:
                    return 'liquid.name.antibiotic';
                case LiquidType.GROWTH_MEDIUM:
                    return 'liquid.name.growth_medium';
                case LiquidType.DNA:
                    return 'liquid.name.dna';
                case LiquidType.GENE:
                    return 'liquid.name.gene';
                case LiquidType.ORGANISM_PROPERTY:
                    return 'liquid.name.organism_property';
                case LiquidType.JUICE:
                    return 'liquid.name.juice';
                case LiquidType.DEADLY:
                    return 'liquid.name.deadly';
                case LiquidType.HOMO_SPLEEN:
                    return 'liquid.name.homo_spleen';
                case LiquidType.INSULIN:
                    return 'liquid.name.insulin';
                case LiquidType.ANTIBODY_GOUT:
                    return 'liquid.name.antibody_gout';
                case LiquidType.ANTIBODY_SMALLPOX:
                    return 'liquid.name.antibody_smallpox';
                case LiquidType.ANTIGEN_GOUT:
                    return 'liquid.name.antigen_gout';
                case LiquidType.ANTIGEN_SMALLPOX:
                    return 'liquid.name.antigen_smallpox';
                case LiquidType.ADJUVANS:
                    return 'liquid.name.adjuvans';
                case LiquidType.LIPASE_ENZYME:
                    return 'liquid.name.lipase_enzyme';
                case LiquidType.GFP:
                    return 'liquid.name.gfp';
                case LiquidType.DESIGNED_DRUG:
                    return 'liquid.name.designed_drug';
                case LiquidType.PRODUCED_INSULIN:
                    return 'liquid.name.produced_insulin';
                case LiquidType.PRODUCED_LIPASE:
                    return 'liquid.name.produced_lipase';
                case LiquidType.PRODUCED_ANTIBODY_GOUT:
                    return 'liquid.name.produced_antibody_gout';
                case LiquidType.PRODUCED_ANTIBODY_POX:
                    return 'liquid.name.produced_antibody_pox';

                default:
                    throw 'TextHelper.prettyNameFromType: Unknown type: ' + type;
                }
            };
        }

    });
    return new TextHelper;
});
