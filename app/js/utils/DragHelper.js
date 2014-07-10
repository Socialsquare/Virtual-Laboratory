define([
    'model/ContainerType'
], function (ContainerType) {
    return {
        acceptTube: function (item) {
            return item.type() === ContainerType.TUBE;
        }
    };
});
