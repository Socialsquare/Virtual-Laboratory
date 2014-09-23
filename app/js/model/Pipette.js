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

                container.addAll(clonedLiqs);
                self.getTip().clearContents();

// Special case for transfering 24 microtiter-wells at once:
                if (container.type() === ContainerType.MICROTITER && !!self.getTip().microtiterWells()) {

                    var clone = self.getTip().microtiterWells().clone();
                    //TODO: merge instead of overwriting? Can't decide...
                    container.microtiterWells(clone);
                    console.log('Cloned wells to microtiter');
                    console.log(container);
                    /*self.getTip().microtiterWells(container.microtiterWells().clone());*/
                }
            };

            self.fillPipette = function(container) {
// 1st modify the pipette
                var clonedLiqs = _.invoke(container.liquids(), 'clone');
                var modifiedLiqs = utils.biology.dilute(50, clonedLiqs);
                self.getTip().addAll(modifiedLiqs);

// 2nd modify the container
                modifiedLiqs = utils.biology.dilute(50/49, container.liquids());

                container.clearContents();
                // prevent trigger because we're not actually adding stuff
                container.addAll(modifiedLiqs, true);

                if (modifiedLiqs.length !== 0) {

                    var contaminating = _.any(container.liquids(), function(liquid) {
                        return liquid.isContaminating();
                    });

                    if (contaminating) {
                        self.getTip().contaminatedBy(container);
                    }
                }

// Special case for transfering 24 microtiter-wells at once:
                if (container.type() === ContainerType.MICROTITER) {
                    self.getTip().microtiterWells(container.microtiterWells().clone());

                    console.log('Cloned wells to pipette-tip');
                    console.log(self.getTip());
                }

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
