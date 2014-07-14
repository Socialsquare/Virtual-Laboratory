define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var Tip = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.PIPETTE_TIP, Math.pow(10,13)); // TODO: Ved ikke om dette skal være mindre. Er ret sikker på det er W/E, bare den ikke er for lille
        }
    });

    return Tip;
});
