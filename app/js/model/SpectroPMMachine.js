define([
    'knockout',
    'model/CompositeContainer',
    'model/type/Container'
], function (ko, CompositeContainerModel, ContainerType) {

    var SpectroPMMachine = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(1, ContainerType.MICROTITER, ContainerType.SPECTROPM_MACHINE);

            //TODO all the things!
            self.hasMicrotiter = function () {
                return self.hasContainerAt(0);
            };
        }

    });

    return SpectroPMMachine;
});
