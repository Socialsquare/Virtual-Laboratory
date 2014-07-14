define([
    'lodash',
    'model/type/Container',
    'model/type/Liquid',
    'model/type/SpecialItem'
], function (_, ContainerType, LiquidType, SpecialItemType) {
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
            var accepted = [
                ContainerType.SYRINGE,
                ContainerType.BOTTLE,
                SpecialItemType.SCALPEL
            ];

            return _.contains(accepted, item.type());
        },

        consumeItemFrom: function (item, collection) {
            return function () {
                collection.remove(item);
            };
        }
    };
});
