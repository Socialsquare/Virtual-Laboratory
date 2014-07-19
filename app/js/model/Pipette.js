define([
    'knockout',
    'lodash',
    'utils/utils',
    'model/CompositeContainer',
    'model/type/Container'
], function (ko, _, utils, CompositeContainerModel, ContainerType) {

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
                var clonedLiqs = _.invoke(self.getTip().liquids(), 'clone');

                console.log('Total concentration before: ' + container.getTotalConcentration());
                container.addAll(clonedLiqs);
                self.getTip().clearContents();
                console.log('Total concentration after: ' + container.getTotalConcentration());
            };

            self.fillPipette = function(container) {
// 1st modify the syringe
                var clonedLiqs = _.invoke(container.liquids(), 'clone');
                var modifiedLiqs = utils.biology.dilute(50, clonedLiqs);
                self.getTip().addAll(modifiedLiqs);

// 2nd modify the container
                console.log('Filled pipette. Total concentration before: ' + container.getTotalConcentration());
                modifiedLiqs = utils.biology.dilute(50/49, container.liquids());
                container.clearContents();
                container.addAll(modifiedLiqs);
                console.log('Filled pipette. Total concentration after: ' + container.getTotalConcentration());

                if (modifiedLiqs.length !== 0) {
                    self.getTip().used(true);
                }

/*=======*//*
                var clonedLiqs = utils.klone(container.liquids);
                var modifiedLiqs = utils.biology.dilute(50, clonedLiqs);
                self.getTip().addAll(modifiedLiqs());

// 2nd modify the container
                console.log('Total concentration before: ' + container.getTotalConcentration());
                modifiedLiqs = utils.biology.dilute(50/49, container.liquids);
                container.clearContents();
                container.addAll(modifiedLiqs());
                console.log('Total concentration after: ' + container.getTotalConcentration());

                if(!modifiedLiqs.isEmpty()) {  self.getTip().used(true); }
*//*>>>>>>> Stashed changes*/
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
