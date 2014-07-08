define([
    'knockout',
    'model/CompositeContainer',
    'model/ContainerType'
], function (ko, CompositeContainerModel, ContainerType) {

    var TubeRackModel = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(6, ContainerType.TUBE, ContainerType.TUBE_RACK);
        },
    });

    return TubeRackModel;
});
