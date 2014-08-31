define([
    'knockout',
    'base',
    'model/CompositeContainer',
    'model/type/Location',
    'model/type/Container'
], function(ko, Base, CompositeContainerModel, LocationType, ContainerType) {

    var SpectroPM = Base.extend({
        //TODO: remove inline CSS from $this.ko

        constructor: function () {
            var self = this;

            self.microSlot = new CompositeContainerModel(1, ContainerType.MICROTITER, ContainerType.SPECTROPM_MACHINE);
            self.microSlot.location(LocationType.SPECTROPM);

            self.reset = function () {
                self.microSlot.removeAll();
            };
        }
    });

    return SpectroPM;
});
