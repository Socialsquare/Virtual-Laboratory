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

    var nonAccepter = function (types) {
        return function (item) {
            return !_.contains(types, item.type());
        };
    };

    return {
        acceptTube: accepter([ContainerType.TUBE]),

        acceptPetri: accepter([ContainerType.PETRI_DISH]),

        acceptMicro: accepter([ContainerType.MICROTITER]),

        acceptDNA: accepter([LiquidType.DNA]),

        acceptPipette: accepter([ContainerType.PIPETTE]),

        acceptSyringe: accepter([ContainerType.SYRINGE]),

        acceptSidegroup: accepter([LiquidType.SIDEGROUP]),

        acceptedByInventory: nonAccepter([ContainerType.BOTTLE, LiquidType.SIDEGROUP, LiquidType.DNA]),

        acceptedByBlender: accepter([SpecialItemType.SPLEEN]),

        acceptedByWashing: accepter([ContainerType.TUBE]),

        acceptedByComposite: accepter([ContainerType.PIPETTE, ContainerType.SYRINGE]),

        acceptedByMouse: accepter([
            ContainerType.SYRINGE,
            ContainerType.BOTTLE,
            ContainerType.TUBE,
            SpecialItemType.SCALPEL
        ]),

        consumeItemFrom: function (item, collection) {
            return function () {
                collection.remove(item);
            };
        }
    };
});
