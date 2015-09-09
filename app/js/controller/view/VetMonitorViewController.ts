import ko = require('knockout');
import _ = require('lodash');

import heartRateJsonData = require('json!datadir/heartRate.json');
import DataHelper = require('utils/DataHelper');

import VetMonitorBaseViewController = require('controller/view/VetMonitorBaseViewController');

import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitor = require('model/interface/VetMonitor');

import VetMonitorModel = require('model/VetMonitorModel');
import VetMonitorWithGirModel = require('model/VetMonitorWithGirModel');
import MouseCage = require('model/MouseCage');


class VetMonitorViewController extends VetMonitorBaseViewController {
    
    public isHrGraphEnabled: KnockoutObservable<boolean>;
    public graphHrRange: KnockoutObservableArray<boolean>;
    //public heartRateData: KnockoutObservableArray<number[]>;
    
    constructor() {
        super('vetmonitor');
        this.vetMonitor = new VetMonitorModel();
        
        this.isHrGraphEnabled = ko.observable(true);
        this.graphHrRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        //this.updatePlotData();
        
        ko.rebind(this);
    }

    exportData() {
        //this.plotData(); // TODO get it from collector or model?
        var raw = {bloodData: [], heartRateData:[]};
        var headers = ['time', 'blood sugar', 'heart rate'];
        var parsed = _(raw.bloodData)
            .zip(raw.heartRateData)
            .map((row) => {
                var bloodsugar = row[0][1];
                var hr;
                if (row[1][1]) {
                    hr = _.sample(heartRateJsonData.pulse);
                } else {
                    hr = row[1][1]; // either null or 0
                }
                var line = [row[0][0], bloodsugar, hr];
                return line;
            })
            .value();

        this.popupController.dataExport(DataHelper.toCSV(parsed, headers));
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
            <PlotItemType>{
                data: this.getHrDataForPlot(),
                yaxis: 2,
                color: 'rgb(255,160,160)'},
            <PlotItemType>{
                data: this.getBloodGlucoseDataForPlot(),
                label: 'mmol/L',
                yaxis: 1,
                color: 'yellow'},
        ];
        this.plotData(toPlot);
    }
    
    nextTimeStep() {
        this.updatePlotData();
    }

    updateGraphRanges() {
        super.updateGraphRanges();
        this.graphHrRange.shift();
        if (this.isHrGraphEnabled()) {
            this.graphHrRange.push(true);
        } else {
            this.graphHrRange.push(false);
        }
    }
}

export = VetMonitorViewController;