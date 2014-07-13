define([
    'knockout',
    'model/CompositeContainer',
    'model/type/Container'
], function (ko, CompositeContainerModel, ContainerType) {

    var MicroSpace = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(3, ContainerType.MICROTITER, ContainerType.MICRO_SPACE);
        }
    });

    return MicroSpace;
});
