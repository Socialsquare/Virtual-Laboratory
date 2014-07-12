define([
    'model/type/Container',
    'model/type/Liquid'
], function (ContainerType, LiquidType) {
    return {
        acceptTube: function (item) {
            return item.type() === ContainerType.TUBE;
        },

        acceptPetri: function (item) {
            return item.type() === ContainerType.PETRI_DISH;
        },

        acceptMicro: function (item) {
            return item.type() === ContainerType.MICROTITER;
        },

        acceptDNA: function (item) {
            return item.type() === LiquidType.DNA;
        },

        acceptedByMouse: function (item) {
            switch (item.type()) {
            // case SpecialType.NEEDLE:
            case ContainerType.BOTTLE:
                return true;

            default:
                return false;
            }
        },

        consumeItemFrom: function (item, collection) {
            return function () {
                collection.remove(item);p
            };
        }
    };
});
