define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var Tip = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            // TODO: correct concentration
            self.base(ContainerType.PIPETTE_TIP, 10000);
        }
    });

    return Tip;
});
