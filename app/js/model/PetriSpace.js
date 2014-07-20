define([
    'knockout',
    'model/CompositeContainer',
    'model/type/Container'

], function (ko, CompositeContainerModel, ContainerType) {

    var PetriSpace = CompositeContainerModel.extend({
        constructor: function (capacity, type) {
            var self = this;

            var type = type || ContainerType.PETRI_SPACE;
            var capacity = capacity || 3;
            self.base(capacity, ContainerType.PETRI_DISH, type);

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
        }
    });

    return PetriSpace;
});
