define([
    'base',

    'model/type/Container',
    'model/type/SpecialItem',
    'model/type/Liquid'
], function (Base, ContainerType, SpecialItemType, LiquidType) {
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

                case LiquidType.INSULIN:
                    return 'liquid.name.insulin';

                case LiquidType.LIPASE_ENZYME:
                    return 'liquid.name.lipase';

                case LiquidType.ANTIBODY_GOUT:
                    return 'liquid.name.antibody_gout';

                case LiquidType.ANTIBODY_SMALLPOX:
                    return 'liquid.name.antibody_smallpox';

                default:
                    throw 'TextHelper.prettyNameFromType: Unknown type: ' + type;
                }
            };
        }

    });
    return new TextHelper;
});
