define([
    'knockout',
    'model/SimpleContainer',
    'model/ContainerType'
], function (ko, SimpleContainerModel, ContainerType) {

    var Electroporator = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.ELECTROPORATOR, 13);

            self.activate = function () {
                throw 'Den er her ikke lige endnu';
            };
        }
    });

    return Electroporator;
});
