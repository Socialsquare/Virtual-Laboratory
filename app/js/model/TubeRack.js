define([
    'knockout',
    'model/CompositeContainer',
    'model/type/Container'

], function (ko, CompositeContainerModel, ContainerType) {

    var TubeRack = CompositeContainerModel.extend({
        constructor: function (type, location) {
            var self = this;

            var type = type || ContainerType.TUBE_RACK;
            self.base(6, ContainerType.TUBE, type);

            self.location = ko.observable();

            self.addAt = function(position, container) {
                container.parentContainer(self);
                self._addAt(position, container);
                return self;
            };

            self.remove = function (position) {
                self.get(position).parentContainer(null);
                self.containers.setAt(position, null);
            };
        },
    });

    return TubeRack;
});
