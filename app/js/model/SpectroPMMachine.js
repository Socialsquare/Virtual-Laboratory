define([
    'knockout',
    'model/CompositeContainer',
    'model/ContainerType'
], function (ko, CompositeContainerModel, ContainerType) {

    var SpectroPMMachine = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(1, ContainerType.MICROTITER, ContainerType.SPECTROPM_MACHINE);


            //TODO all the things!
            self.hasMicrotiter = function () {
                return self.hasContainerAt(0);
            };
            /*
            self.display = ko.computed(function() {
                if(!self.hasMicrotiter())
                    return '';

                return self.get(0).getTotalConcentration();
            });*/
        }

    });

    return SpectroPMMachine;
});
