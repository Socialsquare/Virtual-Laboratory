define([
    'knockout',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, SimpleContainerModel, ContainerType) {

    var Microtiterplate = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.MICROTITER, Math.pow(10, 10));
        }
    });

    return Microtiterplate;
});
