define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var ElectroporatorTank = SimpleContainerModel.extend({

        constructor: function () {
            var self = this;
            self.base(ContainerType.ELECTROPORATOR_TANK, Math.pow(10, 13));
        }
    });

    return ElectroporatorTank;
});
