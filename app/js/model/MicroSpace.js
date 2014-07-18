define([
    'knockout',
    'model/CompositeContainer',
    'model/type/Container'

], function (ko, CompositeContainerModel, ContainerType) {

    var MicroSpace = CompositeContainerModel.extend({
        constructor: function (type) {
            var self = this;

            var type = type || ContainerType.MICRO_SPACE;
            self.base(3, ContainerType.MICROTITER, type);

            self.location = ko.observable();
        }
    });

    return MicroSpace;
});
