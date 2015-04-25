import ko = require('knockout');
import $ = require('jquery');
import _ = require('lodash');
import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');
import LiquidType = require('model/type/Liquid');
import ActivationType = require('model/type/Activation');

class SpectroPM extends BaseViewController {

    constructor() {
        super('spectropm');

        this.spectroPM = this.gameState.spectroPM;
        this.microSlotController = new CompositeContainerController(this.spectroPM.microSlot);
        this.microSlotController.addDropGuard(this.smallPoxGuard);

        this.isClosed = ko.observable(false);

        this.spectroPM.microSlot.containers.subscribe((containers) => {
            var microtiter = containers[0];
            if (!microtiter)
                return;

            this.isClosed(true);

            _.delay(this.isClosed, 1500, false);

            _.delay(() => {
                if (!this.canShowGraph())
                    this.popupController.message('spectropm.no_useful.header','spectropm.no_useful.body');
            },2000);

            this.experimentController.triggerActivation(ActivationType.SPECTROPM, this.spectroPM);
        });

        this.plotData = ko.computed(() => {
            if (this.canShowGraph()) {
                // 1) find the designed drug
                var theDrug = _.find(this.spectroPM.microSlot.get(0).liquids(), (liquid) => {
                    return liquid.type() === LiquidType.DESIGNED_DRUG;
                });

                // 2) get the affinity-score
                var affinityScore = theDrug.getAffinityScore();

                var maxVal = 100; // Percent
                var affinityValue = -8 + affinityScore; //-8 is best! Higher is worse This magic number is also used in controller/Experiment.js
                var s = 2; //Determines how suddenly the graph goes down

                var xVals = _.range(-9, -2.99, 0.1);
                var affinityData = _.map(xVals, (x) => {
                    var y = maxVal / (1 + Math.exp(s * (x - affinityValue)));
                    return [x, y];
                });
                // 3) calculate the plot-data


                return {affinityData: affinityData};
            } else {
                return {affinityData: []};
            }
        });
    }

    public canShowGraph = () => {
        if (!this.spectroPM.microSlot.hasContainerAt(0))
            return false;

        if (this.isClosed())
            return false;

        var liquids = this.spectroPM.microSlot.get(0).liquids();

        var allDrugs = _.filter(liquids, (liquid) => {
            return liquid.type() === LiquidType.DESIGNED_DRUG;
        });

        var allReceptors = _.filter(liquids, (liquid) => {
            return liquid.type() === LiquidType.TARGET_RECEPTOR;
        });

        return allDrugs.length === 1
            && allReceptors.length === 1
            && liquids.length === 2
    }
}

export = SpectroPM;
