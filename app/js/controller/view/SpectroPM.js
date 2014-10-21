define([
    'knockout',
    'jquery',
    'lodash',
    'controller/view/Base',
    'controller/CompositeContainer',
    'model/type/Liquid',
    'model/type/Activation'
], function (ko, $, _, BaseViewController, CompositeContainerController, LiquidType, ActivationType) {

    var SpectroPM = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('spectropm');

            self.spectroPM = self.gameState.spectroPM;
            self.microSlotController = new CompositeContainerController(self.spectroPM.microSlot);

            self.isClosed = ko.observable(false);

            self.spectroPM.microSlot.containers.subscribe(function(containers){
                var microtiter = containers[0];
                if (!microtiter)
                    return;

                self.isClosed(true);

                _.delay(self.isClosed, 1500, false);

                _.delay(function() {
                    if(! self.canShowGraph())
                        self.popupController.message('spectropm.no_useful.header','spectropm.no_useful.body');
                },2000);

                self.experimentController.triggerActivation(ActivationType.SPECTROPM, self.spectroPM);
            });

            self.canShowGraph = function() {
                if (! self.spectroPM.microSlot.hasContainerAt(0)) {
                    return false;
                }

                if (self.isClosed())
                    return false;

                var liquids = self.spectroPM.microSlot.get(0).liquids();

                var allDrugs = _.filter(liquids, function(liquid) {
                    return liquid.type() === LiquidType.DESIGNED_DRUG;
                });

                var allReceptors = _.filter(liquids, function(liquid) {
                    return liquid.type() === LiquidType.TARGET_RECEPTOR;
                });

                if (allDrugs.length === 1 && allReceptors.length === 1 && liquids.length === 2) {
                    return true;
                }else {
                    return false;
                }
            };

            self.plotData = ko.computed(function() {
                if (self.canShowGraph()) {
                    // 1) find the designed drug
                    var theDrug = _.find(self.spectroPM.microSlot.get(0).liquids(), function(liquid) {
                        return liquid.type() === LiquidType.DESIGNED_DRUG;
                    });

                    // 2) get the affinity-score
                    var affinityScore = theDrug.getAffinityScore();

                    var maxVal = 100; // Percent
                    var affinityValue = -8 + affinityScore; //-8 is best! Higher is worse This magic number is also used in controller/Experiment.js
                    var s = 2; //Determines how suddenly the graph goes down

                    var xVals = _.range(-9, -2.99, 0.1);
                    var affinityData = _.map(xVals, function(x) {
                        var y = maxVal / (1 + Math.exp(s * (x - affinityValue)));
                        return [x, y];
                    });
                    // 3) calculate the plot-data


                    return {affinityData: affinityData};
                }else {
                    return {affinityData: []};
                }
            });
        }
    });

    return SpectroPM;
});
