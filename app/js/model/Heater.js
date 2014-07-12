define([
    'knockout',
    'model/CompositeContainer',
    'model/type/Container'
], function (ko, CompositeContainerModel, ContainerType) {

    var HeaterModel = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(3, ContainerType.TUBE, ContainerType.HEATER);

            self.status = ko.observable(false);

            self.activate = function () {
                // TODO: implement
                throw 'JegErHerIkke, Derfor: Undtagelsestilstand';
            };

        },
    });

    return HeaterModel;
});
