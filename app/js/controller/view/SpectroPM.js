define([
    'knockout',
    'jquery',
    'lodash',
    'controller/view/Base',
    'controller/CompositeContainer',
    'model/type/Liquid'
], function (ko, $, _, BaseViewController, CompositeContainerController, LiquidType) {

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

                var allDrugs = _.filter(self.spectroPM.microSlot.get(0).liquids(), function(liquid) {
                    return liquid.type() === LiquidType.DESIGNED_DRUG;
                });

                if(allDrugs.length === 0) {
                    console.log('TODO: tell that no useful data was found.');
                    return false;
                }else if (allDrugs.length === 1) {
                    return true;
                }else {
                    console.log('TODO: tell that no useful data was found.');
                    return false;
                }


            };

            self.plotData = ko.computed(function() {
                console.log('TODO: updated spectro-plotData');
                if (self.canShowGraph()) {
                    //TODO:
                    // 1) find the designed drug
                    var theDrug = _.find(self.spectroPM.microSlot.get(0).liquids(), function(liquid) {
                        return liquid.type() === LiquidType.DESIGNED_DRUG;
                    });

                    // 2) get the affinity-score
                    var affinityScore = theDrug.getAffinityScore();

                    var maxVal = 100; // Percent
                    var affinityValue = -8 + affinityScore; //-8 is best! Higher is worse
                    var s = 2; //Determines how suddenly the graph goes down

                    console.log('TODO: maxVal: ' + maxVal + ', affinityScore: ' + affinityValue + ', s: ' + s);

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
