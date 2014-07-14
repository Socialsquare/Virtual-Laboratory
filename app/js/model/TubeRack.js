define([
    'knockout',
    'model/CompositeContainer',
    'model/type/Container'

], function (ko, CompositeContainerModel, ContainerType) {

    var TubeRack = CompositeContainerModel.extend({
        constructor: function (type) {
            var self = this;

            var type = type || ContainerType.TUBE_RACK;
            self.base(6, ContainerType.TUBE, type);
        },
    });

    return TubeRack;
});
