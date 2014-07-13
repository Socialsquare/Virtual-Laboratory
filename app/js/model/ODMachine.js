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

                var conc = self.get(0).getTotalConcentration();

                if (conc === 0)
                    return '0.0';

                var logConc = Utils.math.getBaseLog(10, conc);
                return '' + logConc.toFixed(1);
            });
        }

    });

    return ODMachine;
});
