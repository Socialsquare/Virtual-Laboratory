define([
    'knockout',
    'utils/utils',
    'model/CompositeContainer',
    'model/type/Container'
], function (ko, utils, CompositeContainerModel, ContainerType) {

    var Pipette = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(1, ContainerType.PIPETTE_TIP, ContainerType.PIPETTE);

            self.active = ko.observable(false);

            self.hasTip = function () {
                return self.hasContainerAt(0);
            };

            self.getTip = function() {
                return self.get(0);
            };

            self.removeTip = function () {
                self.remove(0);
            };

            self.emptyPipetteInto = function(container) {
                var cloned_liqs = utils.klone(self.getTip().liquids);

                console.log('Total concentration before: ' + container.getTotalConcentration());
                container.addAll(cloned_liqs());
                self.getTip().clearContents();
                console.log('Total concentration after: ' + container.getTotalConcentration());
            };

            self.fillPipette = function(container) {
// 1st modify the syringe
                var cloned_liqs = utils.klone(container.liquids);
                var modified_liqs = utils.biology.dilute(50, cloned_liqs);
                self.getTip().addAll(modified_liqs());

// 2nd modify the container
                console.log('Total concentration before: ' + container.getTotalConcentration());
                modified_liqs = utils.biology.dilute(50/49, container.liquids);
                container.clearContents();
                container.addAll(modified_liqs());
                console.log('Total concentration after: ' + container.getTotalConcentration());

                if(!modified_liqs.isEmpty()) {  self.getTip().used(true); }
            };

            self.isEmpty = ko.computed(function () {
                if (!self.hasTip())
                    return false;

                return self.get(0).isEmpty();
            });
        }
    });

    return Pipette;
});
