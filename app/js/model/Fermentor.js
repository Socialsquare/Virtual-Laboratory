define([
    'knockout',
    'model/CompositeContainer',
    'model/ContainerType'
], function (ko, CompositeContainerModel, ContainerType) {

    var FermentorModel = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(1, ContainerType.FERMENTOR_TANK, ContainerType.FERMENTOR);
        },
    });

    return FermentorModel;
});
