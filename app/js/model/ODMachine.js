define([
    'knockout',
    'model/CompositeContainer',
    'model/ContainerType'
], function (ko, CompositeContainerModel, ContainerType) {

    var ODMachine = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(1, ContainerType.TUBE, ContainerType.OD_MACHINE);

            self.display = ko.computed(function() {

                if(!self.get(0))
                    return '';
                else
                    return self.get(0).getTotalConcentration();

            });
        }

    });

    return ODMachine;
});
