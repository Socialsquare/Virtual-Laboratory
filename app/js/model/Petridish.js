define([
    'knockout',
    'model/SimpleContainer',
    'model/ContainerType'
], function (ko, SimpleContainerModel, ContainerType) {

    var Petridish = SimpleContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(ContainerType.PETRI_DISH, 12);
        }
    });

    return Petridish;
});
