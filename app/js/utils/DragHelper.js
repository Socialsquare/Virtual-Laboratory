define([
    'lodash',
    'model/type/Container',
    'model/type/Liquid',
    'model/type/SpecialItem'
], function (_, ContainerType, LiquidType, SpecialItemType) {
    var accepter = function (types) {
        return function (item) {
            return _.contains(types, item.type());
        };
    };

    return {
        acceptTube: accepter([ContainerType.TUBE]),

        acceptPetri: accepter([ContainerType.PETRI_DISH]),

        acceptMicro: accepter([ContainerType.MICROTITER]),

        acceptDNA: accepter([LiquidType.DNA]),

        acceptedByBlender: accepter([SpecialItemType.SPLEEN]),

        acceptedByComposite: accepter([ContainerType.PIPETTE]),

        acceptedByMouse: accepter([
            ContainerType.SYRINGE,
            ContainerType.BOTTLE,
            SpecialItemType.SCALPEL
        ]),

        consumeItemFrom: function (item, collection) {
            return function () {
                collection.remove(item);
            };
        }
    };
});
