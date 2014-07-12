define([
    'model/ContainerType',
    'model/LiquidType'
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

        consumeItemFrom: function (item, collection) {
            return function () {
                collection.remove(item);p
            };
        }
    };
});
