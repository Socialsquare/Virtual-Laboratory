define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'controller/CompositeContainer',
    'model/type/Liquid'
], function (ko, $, BaseViewController, CompositeContainerController, LiquidType) {

    var SpectroPM = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('spectropm');

            self.spectroPM = self.gameState.spectroPM;
            self.microSlotController = new CompositeContainerController(self.spectroPM.microSlot);

            self.canShowGraph = function() { //TODO: make ko.computed()
                if (! self.spectroPM.microSlot.hasContainerAt(0)) {
                    return false;
                }

                return self.spectroPM.microSlot.get(0).contains(LiquidType.DESIGNED_DRUG);
            };

            self.plotData = ko.computed(function() {
                if (self.canShowGraph()) {
                    return {affinityData: [[-9, 100], [-8, 95], [-7, 85], [-6, 50], [-5, 15], [-4, 5], [-3, 0]]};
                }else {
                    return {affinityData: []};
                }
            });
        }
    });

    return SpectroPM;
});
