define([
    'knockout',
    'controller/view/Base',
    'controller/CompositeContainer'
], function (ko, BaseViewController, CompositeContainerController) {

    var IncubatorController = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('incubator');

            self.incubator = self.gameState.incubator;

            self.tubeRackController = new CompositeContainerController(self.incubator.tubeRack);
            self.tubeRackController.imageGetter = self.ImageHelper.incubatorTubeRackImage;

            self.petriSpaceController = new CompositeContainerController(self.incubator.tableSpacePetri);
            self.petriSpaceController.imageGetter = self.ImageHelper.incubatorPetriImage;
            self.petriSpaceController.imagePlaceholderGetter = self.ImageHelper.incubatorPetriPlaceholderImage;

            self.changeTemp = function(val) {
                self.incubator.temperature(self.incubator.temperature() + val);
            };

            self.changeTimer = function(val) {
                var newVal = self.incubator.timer() + val;
                newVal = newVal < 0 ? 0 : newVal;
                self.incubator.timer(newVal);
            };

            self.activateIncubator = function() {
                self.incubator.activate();
                // TODO: wait for completion?
                self.experimentController.triggerActivation(self.ActivationType.INCUBATOR);
            };
        },
    });

    return IncubatorController;
});
