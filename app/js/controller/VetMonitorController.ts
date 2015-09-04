import ko = require('knockout');
import _ = require('lodash');

import heartRateJsonData = require('json!datadir/heartRate.json');

import DataHelper = require('utils/DataHelper');
import BaseViewController = require('controller/view/Base');
import VetMonitorModel = require('model/VetMonitorModel');
import MouseCage = require('model/MouseCage');


type DataPoint = [number, number];


type PlotData = {
    bloodData: DataPoint[];
    heartRateData: DataPoint[];
    glucoseInfusionRateData: DataPoint[];
}


class VetMonitorController extends BaseViewController {
    public mousecage: MouseCage;
    public vetMonitor: VetMonitorModel;
    
    public plotData: KnockoutObservable<PlotData>;
    public isHrGraphEnabled: KnockoutObservable<boolean>;

    public isBloodSugarGraphEnabled: KnockoutObservable<boolean>;
    public isGirGraphEnabled: KnockoutObservable<boolean>;
    
    public graphRangeStart: number = 0;
    public graphRangeEnd: number = 250;
    public graphRange: number[] = [];
    public graphHrRange: KnockoutObservableArray<boolean>;
    public graphBloodRange: KnockoutObservableArray<boolean>;
    public graphGirRange: KnockoutObservableArray<boolean>;
    public glucoseData: KnockoutObservableArray<number>;

    constructor() {
        super('vetmonitor');
        
        this.vetMonitor = new VetMonitorModel();
        this.mousecage = this.gameState.mousecage;
        
        this.isHrGraphEnabled = ko.observable(false);
        this.isBloodSugarGraphEnabled = ko.observable(true);
        this.isGirGraphEnabled = ko.observable(true);
        
        this.graphRange = _.range(this.graphRangeStart, this.graphRangeEnd);

        this.graphBloodRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.graphHrRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.graphGirRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.glucoseData =
            ko.observableArray(_.map(this.graphRange, (v) => { return null; }));
        this.plotData = ko.observable(<PlotData>{
            bloodData: [],
            heartRateData: [],
            glucoseInfusionRateData: []
        });
        
        ko.rebind(this);
    }
    
    exportData() {
        var raw = this.plotData();
        var headers = ['time', 'bloodsugar', 'heart'];
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

    toggleGlucoseInfusionRate(): void {
        this.isGirGraphEnabled.toggle();
    }

    toggleHartRate(): void {
        this.isHrGraphEnabled.toggle();
    }

    toggleBloodSugar(): void {
        this.isBloodSugarGraphEnabled.toggle();
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

        this.graphGirRange.shift();
        if (this.isGirGraphEnabled()) {
            this.graphGirRange.push(true);
        } else {
            this.graphGirRange.push(false);
        }
    }
    
    /**
     * Generates blood sugar leveldata for plot graph.
     * If mouse is dead sugar level is 0.
     * if blood sugar level graph is disabled sugar level is null.
     * @return {Array}
     */
    getBloodDataForPlot():DataPoint[] {
        var bloodData = _.map(this.graphRange, (i): DataPoint => {
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
     * @return {Array}
     */
    getHrDataForPlot():DataPoint[] {
        var hrData = [];
        hrData = _.map(this.graphRange, (i): DataPoint => {
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
    /**
     * Generates Glucose Infusion Rate data for plot graph.
     * If mouse is dead it's GIR is 0.
     * if HR graph is disabled GIR is null.
     * @return {Array}
     */
    getGirDataForPlot():DataPoint[] {
        var girData = [];
        girData = _.map(this.graphRange, (i): DataPoint => {
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
        var bloodData = this.getBloodDataForPlot();
        var heartRateData = this.getHrDataForPlot();
        var glucoseInfusionRateData = this.getGirDataForPlot();

        this.plotData({
            bloodData: bloodData,
            heartRateData: heartRateData,
            glucoseInfusionRateData: glucoseInfusionRateData
        });
    }
    
    storeGlucoseStep(gir) {
        this.glucoseData.shift()
        this.glucoseData.push(gir)
    }


}

export = VetMonitorController;