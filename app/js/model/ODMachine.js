define([
    'knockout',
    'utils/utils',
    'model/CompositeContainer',
    'model/type/Container'
], function (ko, Utils, CompositeContainerModel, ContainerType) {

    var ODMachine = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(1, ContainerType.TUBE, ContainerType.OD_MACHINE);

            self.hasTube = function () {
                return self.hasContainerAt(0);
            };

            self.display = ko.computed(function() {
                if(!self.hasTube())
                    return '';
                var logConc = Utils.math.getBaseLog(10, self.get(0).getTotalConcentration());
                return '' + logConc.toFixed(1);
            });
        }

    });

    return ODMachine;
});
