define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var Tube = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.TUBE, Math.pow(10,13));
        }
    });

    return Tube;
});
