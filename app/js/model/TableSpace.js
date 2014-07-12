define([
    'knockout',
    'model/CompositeContainer',
    'model/type/Container'
], function (ko, CompositeContainerModel, ContainerType) {

    var TableSpace = CompositeContainerModel.extend({
        constructor: function (acceptedType) {
            var self = this;
            self.base(3, acceptedType, ContainerType.TABLE_SPACE);
        }
    });

    return TableSpace;
});
