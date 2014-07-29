define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var FermentorTank = SimpleContainerModel.extend({

// TODO only organisms with a "has been in high concentration"-flag. This imitates IRL...

        constructor: function () {
            var self = this;
            self.hasRun = ko.observable(false); //This is used when restarting the fermentor.
            self.base(ContainerType.FERMENTOR_TANK, Math.pow(10, 13));
        }
    });

    return FermentorTank;
});
