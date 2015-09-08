import ko = require('knockout');
import _ = require('lodash');

import heartRateJsonData = require('json!datadir/heartRate.json');

import DataHelper = require('utils/DataHelper');
import BaseViewController = require('controller/view/Base');
import VetMonitor = require('model/type/VetMonitor');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitorWithGirModel = require('model/VetMonitorWithGirModel');
import MouseCage = require('model/MouseCage');


class VetMonitorViewController extends BaseViewController {
    public mousecage: MouseCage;
    public vetMonitor: VetMonitor;
    
    constructor() {
        super('vetmonitorwithgir');
        this.vetMonitor = new VetMonitorWithGirModel();
        
        this.mousecage = this.gameState.mousecage;
        
        ko.rebind(this);
    }
    
    /**
     * Generates blood sugar leveldata for plot graph.
     * If mouse is dead sugar level is 0.
     * if blood sugar level graph is disabled sugar level is null.
     */
    getBloodGlucoseDataForPlot():PlotDataPointType[] {
        var bloodData = _.map(this.graphRange, (i): PlotDataPointType => {
            var sugar = null;
            if (!this.mousecage.mouse().alive()) {
                sugar = 0;
            } else if (this.graphBloodRange()[i]) {
                sugar = this.mousecage.mouse().bloodData()[i];
            }
            return [i, sugar];
        });
        return bloodData;
    }

    /**
     * Generates Glucose Infusion Rate data for plot graph.
     * If mouse is dead it's GIR is 0.
     * if HR graph is disabled GIR is null.
     */
    getGirDataForPlot():PlotDataPointType[] {
        var girData = [];
        girData = _.map(this.graphRange, (i): PlotDataPointType => {
            var gir = null;

            if (!this.mousecage.mouse().alive()) {
                gir = 0;
            } else if (this.graphGirRange()[i]) {
                gir = this.glucoseData()[i];
            }
            return [i, gir];
        });
        return girData;
    }

    updatePlotData() {

        this.updateGraphRanges();

        var toPlot =  [
            new PlotItemType({
                data: this.getBloodGlucoseDataForPlot(),
                label: 'mmol/L',
                yaxis: 1,
                color: 'yellow' }),
            new PlotItemType({
                data: this.getGirDataForPlot(),
                label: 'mmol/L',
                yaxis: 1,
                color: 'blue'})
        ];
        }
        this.plotData(toPlot);
    }
    
    storeGlucoseStep(gir) {
        this.glucoseData.shift()
        this.glucoseData.push(gir)
    }

    nextTimeStep() {
        this.storeGlucoseStep(
            this.glucoseBagController.glucoseBag.glucoseInfusionRate())
        this.updatePlotData();
    }

    updateGraphRanges() {
        this.graphBloodRange.shift();
        if (this.isBloodSugarGraphEnabled()) {
            this.graphBloodRange.push(true);
        } else {
            this.graphBloodRange.push(false);
        }

        this.graphGirRange.shift();
        if (this.isGirGraphEnabled()) {
            this.graphGirRange.push(true);
        } else {
            this.graphGirRange.push(false);
        }
    }

}

export = VetMonitorWithGirViewController;