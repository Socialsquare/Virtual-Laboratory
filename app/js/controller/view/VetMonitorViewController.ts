import ko = require('knockout');
import _ = require('lodash');

import heartRateJsonData = require('json!datadir/heartRate.json');
import DataHelper = require('utils/DataHelper');
import BaseViewController = require('controller/view/Base');
import VetMonitor = require('model/type/VetMonitor');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitorModel = require('model/VetMonitorModel');
import VetMonitorWithGirModel = require('model/VetMonitorWithGirModel');
import MouseCage = require('model/MouseCage');


class VetMonitorViewController extends BaseViewController {
    public mousecage: MouseCage;
    public vetMonitor: VetMonitor;
    
    constructor() {
        super('vetmonitor');
        this.vetMonitor = new VetMonitorModel();
        this.mousecage = this.gameState.mousecage;
        this.plotData = ko.observable([]);
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
     * Generates pulse data for plot graph.
     * If mouse is dead it's HR is 0.
     * if HR graph is disabled HR is null.
     */
    getHrDataForPlot():PlotDataPointType[] {
        var hrData = [];
        hrData = _.map(this.graphRange, (i): PlotDataPointType => {
            var hr = null;

            var dataIndex = this.mousecage.mouse().heartRateIndex + i;
            dataIndex = dataIndex % this.mousecage.mouse().heartRateData.length;
            if (!this.mousecage.mouse().alive()) {
                hr = 0;
            } else if (this.graphHrRange()[i]) {
                hr = this.mousecage.mouse().heartRateData[dataIndex];
            }
            return [i, hr];
        });
        return hrData;
    }

    updatePlotData() {
        this.updateGraphRanges();
        var toPlot =  [
            new PlotItemType({
                data: this.getHrDataForPlot(),
                yaxis: 2,
                color: 'rgb(255,160,160)'}),
            new PlotItemType({
                data: this.getBloodGlucoseDataForPlot(),
                label: 'mmol/L',
                yaxis: 1,
                color: 'yellow'})
        ];
        this.plotData(toPlot);
    }
    
    nextTimeStep() {
        this.updatePlotData();
    }

    updateGraphRanges() {
        this.graphHrRange.shift();
        if (this.isHrGraphEnabled()) {
            this.graphHrRange.push(true);
        } else {
            this.graphHrRange.push(false);
        }

        this.graphBloodRange.shift();
        if (this.isBloodSugarGraphEnabled()) {
            this.graphBloodRange.push(true);
        } else {
            this.graphBloodRange.push(false);
        }
    }
}

export = VetMonitorViewController;