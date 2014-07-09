define([
    'knockout',
    'lodash',
    'model/SimpleContainer',
    'model/ContainerType'
], function (ko, _, SimpleContainerModel, ContainerType) {

    var Electroporator = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.ELECTROPORATOR, 13);

            self.status = ko.observable(false);

            self.activate = function () {
                self.status(true);

                _.delay(self.status, 1000, false);

                //TODO: implement
            };
        }
    });

    return Electroporator;
});
