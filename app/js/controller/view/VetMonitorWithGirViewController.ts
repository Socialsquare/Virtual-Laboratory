import ko = require('knockout');
import _ = require('lodash');

import heartRateJsonData = require('json!datadir/heartRate.json');
import DataHelper = require('utils/DataHelper');
import popupController = require('controller/Popup');
import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitor = require('model/interface/VetMonitor');
import VetMonitorWithGirModel = require('model/VetMonitorWithGirModel');
import MouseCage = require('model/MouseCage');
import MouseModel = require('model/Mouse');


class VetMonitorWithGirViewController {
    public mouse: KnockoutObservable<MouseModel>;
    public mouseCageHasMouse: KnockoutObservable<boolean>;
    public glucoseInfusionRate: KnockoutObservable<number>;
    public vetMonitor: VetMonitor;

    public simulationInterval: number;
    public simulationIntervalTime: number = 100;  // millisecond

    public graphRangeStart: number = 0;
    public graphRangeEnd: number = 250;
    public graphRange: number[];

    public isBloodSugarGraphEnabled: KnockoutObservable<boolean>;
    public graphBloodRange: KnockoutObservableArray<boolean>;
    public isGirGraphEnabled: KnockoutObservable<boolean>;
    public graphGirRange: KnockoutObservableArray<boolean>;
    public girDataForPlot: KnockoutObservableArray<number[]>;
    private _mouseSubscription = null;
    
    constructor(params) {
        if (params === undefined) return;
        this.mouse = params.mouse;  // KnockoutObservable
        this.mouseCageHasMouse = params.hasMouse;  // KnockoutObservable
        this.glucoseInfusionRate = ko.observable(params.glucoseInfusionRate);
        this.vetMonitor = new VetMonitorWithGirModel();
        
        this.graphRange = _.range(this.graphRangeStart, this.graphRangeEnd);
        this.isBloodSugarGraphEnabled = ko.observable(true);
        this.graphBloodRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));

        this.isGirGraphEnabled = ko.observable(true);
        this.graphGirRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.girDataForPlot =
            ko.observableArray(_.map(this.graphRange, (v) => { return null; }));

        this.simulationInterval = null;
        this.plotData = ko.observableArray(null);

        ko.rebind(this);
    }

    exportData() {
        // TODO get it from collector or model?
        var raw = {bloodData: [], heartRateData:[]};
        var headers = ['time', 'blood sugar', 'GIR'];
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

        popupController.dataExport(DataHelper.toCSV(parsed, headers));
    }

    isBloodSugarGraphEnabledToggle() {
        this.isBloodSugarGraphEnabled(!this.isBloodSugarGraphEnabled());
    }
    
    isGirGraphEnabledToggle() {
        this.isGirGraphEnabled(!this.isGirGraphEnabled());
    }

    /**
     * Generates blood sugar leveldata for plot graph.
     * If mouse is dead sugar level is 0.
     * if blood sugar level graph is disabled sugar level is null.
     */
    getBloodGlucoseDataForPlot():PlotDataPointType[] {
        if (! this.mouseCageHasMouse())
            return [];
        var bloodData = _.map(this.graphRange, (i): PlotDataPointType => {
            var sugar = null;
            if (!this.mouse().alive()) {
                sugar = 0;
            } else if (this.graphBloodRange()[i]) {
                sugar = this.mouse().bloodData()[i];
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
        if (! this.mouseCageHasMouse())
            return [];
        var girDataToPlot = _.map(this.graphRange, (i): PlotDataPointType => {
            var gir = null;
            if (!this.mouse().alive()) {
                gir = 0;
            } else if (this.graphGirRange()[i]) {
                gir = this.girDataForPlot()[i];
            }
            return [i, gir];
        });
        return girDataToPlot;
    }

    updatePlotData() {
        this.updateGraphRanges();
        var toPlot = [
            <PlotItemType> {
                data: this.getBloodGlucoseDataForPlot(),
                label: 'mmol/L',
                yaxis: 1,
                color: 'yellow' },
            <PlotItemType>{
                data: this.getGirDataForPlot(),
                label: 'mmol/L',
                yaxis: 1,
                color: 'blue'},
        ];
        this.plotData.removeAll();
        this.plotData(toPlot);
    }
    
    addGlucoseStepToPlotData() {
        this.girDataForPlot.shift();
        this.girDataForPlot.push(this.glucoseInfusionRate());
    }
    
    nextTimeStep() {
        if (!this.mouseCageHasMouse())
            return;
        this.addGlucoseStepToPlotData();
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
    
    toggleSimulation(enabled: boolean) {
        if ((enabled) && (this.simulationInterval === null)) {
            this.simulationInterval = setInterval(this.nextTimeStep,
                                                this.simulationIntervalTime);
        } else {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
    }
    
    enter() {
        if (this.mouseCageHasMouse())
            this.toggleSimulation(true);
        this._mouseSubscription = this.mouse.subscribe((newmouse) => {
            this.toggleSimulation(<boolean>newmouse);
        });
    }

    dispose() {
        this.toggleSimulation(false);
        this.plotData.removeAll();
        this.plotData([]);
        if (this._mouseSubscription)
            this._mouseSubscription.dispose();
    }

}

export = VetMonitorWithGirViewController;