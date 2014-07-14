define([
    'knockout',
    'base',
    'model/SimpleContainer',
    'model/type/Container'
], function (ko, Base, SimpleContainerModel, ContainerType) {

    var Blender = Base.extend({
        constructor: function () {
            var self = this;

            self.status = ko.observable(false);
        }
    });

    return Blender;
});
