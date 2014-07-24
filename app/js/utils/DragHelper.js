define([
    'lodash',

    'model/type/Container',
    'model/type/Liquid',
    'model/type/SpecialItem'

], function (_, ContainerType, LiquidType, SpecialItemType) {

    var accepter = function (types) {
        return function (item) {
            return item && item.type && _.contains(types, item.type());
        };
    };

    var nonAccepter = function (types) {
        return function (item) {
            return item && item.type && !_.contains(types, item.type());
        };
    };

    return {
        acceptTube: accepter([ContainerType.TUBE]),

        acceptPetri: accepter([ContainerType.PETRI_DISH]),

        acceptMicro: accepter([ContainerType.MICROTITER]),

        acceptDNA: accepter([LiquidType.DNA]),

        acceptPipette: accepter([ContainerType.PIPETTE]),

        acceptSyringe: accepter([ContainerType.SYRINGE]),

        acceptSidegroup: accepter([SpecialItemType.SIDEGROUP]),

        acceptSidegroupSlot: accepter([SpecialItemType.SIDEGROUP_SLOT]),

        acceptedByInventory: nonAccepter([ContainerType.BOTTLE, LiquidType.SIDEGROUP, LiquidType.DNA]),

        acceptedByBlender: accepter([SpecialItemType.SPLEEN]),

        acceptedByWashing: accepter([ContainerType.TUBE]),

        acceptedByComposite: accepter([
            ContainerType.PIPETTE,
            ContainerType.SYRINGE,
            SpecialItemType.WASH_BOTTLE
        ]),

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
