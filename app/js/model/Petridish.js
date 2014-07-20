define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var Petridish = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.PETRI_DISH, Math.pow(10,12));

            self.parentContainer = ko.observable(null); // Used for location-checking
        }
    });

    return Petridish;
});
