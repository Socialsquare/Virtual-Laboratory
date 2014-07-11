define([
    'knockout',
    'model/SimpleContainer',
    'model/ContainerType'
], function (ko, SimpleContainerModel, ContainerType) {

    var FermentorTank = SimpleContainerModel.extend({

// TODO only organisms with a concentration of

        constructor: function () {
            var self = this;
            self.base(ContainerType.FERMENTOR_TANK, Math.pow(10, 13));

            self.activate = function () {
                throw 'Den er her ikke lige endnu';
            };
        }
    });

    return FermentorTank;
});
