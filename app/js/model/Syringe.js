define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var Syringe = SimpleContainerModel.extend({

        constructor: function (type) {
            var self = this;
            // TODO: correct concentration?
            self.base(ContainerType.SYRINGE, 100);
        }
    });

    return Syringe;
});
