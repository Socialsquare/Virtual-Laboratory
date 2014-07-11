define([
    'model/ContainerType',
    'model/LiquidType'
], function (ContainerType, LiquidType) {
    return {
        acceptTube: function (item) {
            return item.type() === ContainerType.TUBE;
        },

        acceptDNA: function (item) {
            return item.type() === LiquidType.DNA;
        }
    };
});
