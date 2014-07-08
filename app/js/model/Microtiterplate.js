define([
    'knockout',
    'model/SimpleContainer',
    'model/ContainerType'
], function (ko, SimpleContainerModel, ContainerType) {

    var Microtiterplate = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.MICROTITER, 10);
        }
    });

    return Microtiterplate;
});
