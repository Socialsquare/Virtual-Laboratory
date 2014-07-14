define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var WashingTank = SimpleContainerModel.extend({

        // TODO: only organisms with a concentration of

        constructor: function () {
            var self = this;
            self.base(ContainerType.WASHING_TANK, Math.pow(10, 13));

            self.activate = function () {
                console.log('TODO: WashingTank');
            };
        }
    });

    return WashingTank;
});
