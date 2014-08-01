define([
    'knockout',
    'model/SimpleContainer',
    'model/Well',
    'model/type/Container'
], function (ko, SimpleContainerModel, WellModel, ContainerType) {

    var Microtiterplate = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.MICROTITER, Math.pow(10, 10));
            self.wells = ko.observableArray([]);

            for(var i = 0; i < 4; i++){
                self.wells.push(new WellModel());
            }
        }
    });

    return Microtiterplate;
});
