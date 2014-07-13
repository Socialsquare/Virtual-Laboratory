define([
    'knockout',
    'model/CompositeContainer',
    'model/type/Container'
], function (ko, CompositeContainerModel, ContainerType) {

    var PetriSpace = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(3, ContainerType.PETRI_DISH, ContainerType.PETRI_SPACE);
        }
    });

    return PetriSpace;
});
