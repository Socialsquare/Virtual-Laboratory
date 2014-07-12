define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var Bottle = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.BOTTLE, 0);
        }
    });

    return Bottle;
});
