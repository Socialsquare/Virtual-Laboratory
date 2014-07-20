define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var Microtiterplate = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.MICROTITER, Math.pow(10, 10));

            self.parentContainer = ko.observable(null); // Used for location-checking
        }
    });

    return Microtiterplate;
});
