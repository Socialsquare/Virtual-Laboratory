define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var WashingTank = SimpleContainerModel.extend({

        constructor: function () {
            var self = this;
            self.base(ContainerType.WASHING_TANK, Math.pow(10, 13));
        }
    });

    return WashingTank;
});
