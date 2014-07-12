define([
    'knockout',
    'model/CompositeContainer',
    'model/type/Container'
], function (ko, CompositeContainerModel, ContainerType) {

    var TubeRack = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(6, ContainerType.TUBE, ContainerType.TUBE_RACK);
        },
    });

    return TubeRack;
});
