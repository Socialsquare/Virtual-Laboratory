define([
    'knockout',
    'model/CompositeContainer',
    'model/ContainerType'
], function (ko, CompositeContainerModel, ContainerType) {

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

                return self.get(0).getTotalConcentration();
            });
        }

    });

    return ODMachine;
});
