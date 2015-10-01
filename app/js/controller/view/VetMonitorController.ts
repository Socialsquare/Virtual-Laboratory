import ko = require('knockout');
import _ = require('lodash');

import heartRateJsonData = require('json!datadir/heartRate.json');
import DataHelper = require('utils/DataHelper');

import popupController = require('controller/Popup');
import experimentController = require('controller/Experiment');

import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitorModel = require('model/VetMonitorModel');
import MouseModel = require('model/Mouse');


class VetMonitorController {
    public mouse: KnockoutObservable<MouseModel>;
    public mouseCageHasMouse: KnockoutComputed<boolean>;
    public glucoseInfusionRate: KnockoutObservable<number>;
    public vetMonitor;

    public simulationInterval: number = null
    public simulationIntervalTime: number = 100;  // millisecond

    public graphRangeStart: number = 0;
    public graphRangeEnd: number = 250;
    public graphRange: number[];

    public isBloodSugarGraphEnabled: KnockoutObservable<boolean>;
    public graphBloodRange: KnockoutObservableArray<boolean>;
    //public bloodGlucoseData: KnockoutObservableArray<number>;

    public isGirGraphEnabled: KnockoutObservable<boolean>;
    public graphGirRange: KnockoutObservableArray<boolean>;
    public girDataForPlot: KnockoutObservableArray<number>;
    
    public isHrGraphEnabled: KnockoutObservable<boolean>;
    public graphHrRange: KnockoutObservableArray<boolean>;
    //public heartRateData: KnockoutObservableArray<number>;

    public plotData: KnockoutObservableArray<any>;
    private _mouseSubscription = null;
    
    constructor(params) {
        console.log("VetMonitorController() constructor");
        console.log(params);
        if (params === undefined) return;
        this.mouse = params.mouse;  // KnockoutObservable
        this.mouseCageHasMouse = params.hasMouse;  // KnockoutObservable
        if (params.glucoseInfusionRate === null){
            this.glucoseInfusionRate = ko.observable(null);
        } else {
            this.glucoseInfusionRate = params.glucoseInfusionRate;  // KnockoutObservable
        }
        this.vetMonitor = new VetMonitorModel();
        
        this.isBloodSugarGraphEnabled = ko.observable(true);
        this.graphRange = _.range(this.graphRangeStart, this.graphRangeEnd);
        this.graphBloodRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        
        this.isHrGraphEnabled = ko.observable(false);
        this.isGirGraphEnabled = ko.observable(true);
        
        if (this.glucoseInfusionRate() !== null) {
            this.isHrGraphEnabled(false);
            this.isGirGraphEnabled(true);
        } else {
            this.isHrGraphEnabled(true);
            this.isGirGraphEnabled(false);
        }

        this.graphGirRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.girDataForPlot =
            ko.observableArray(_.map(this.graphRange, (v) => { return null; }));            
            
        this.graphHrRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        
        this.plotData = ko.observableArray(null);

        ko.rebind(this);
    }
    
    // FIXME: for some reason ko.toggle() doesn't work with this component
    // FIXME: so I added public methods isHrGraphEnabledToggle,
    // FIXME: isBloodSugarGraphEnabledToggle, isGirGraphEnabledToggle
    isHrGraphEnabledToggle() {
        this.isHrGraphEnabled(!this.isHrGraphEnabled());
    }
    
    isBloodSugarGraphEnabledToggle() {
        this.isBloodSugarGraphEnabled(!this.isBloodSugarGraphEnabled());
    }

    isGirGraphEnabledToggle() {
        this.isGirGraphEnabled(!this.isGirGraphEnabled());
    }
    
    exportData() {
        //// TODO get it from collector or model?
        var raw = {bloodData: [], heartRateData:[], girData:[]};
        var headers = ['time', 'blood sugar', 'heart rate', 'GIR'];
        var parsed = _(raw.bloodData)
            .zip(raw.heartRateData)
            .map((row) => {
                var bloodsugar = row[0][1];
                var hr;
                var gir;
                var currTime = row[0][0];
                if (row[1][1]) {
                    hr = _.sample(heartRateJsonData.pulse);
                } else {
                    hr = row[1][1]; // either null or 0
                }
                if (row[2][1]) {
                    gir = row[2][1]; // either null or 0
                } 
                var line = [currTime, bloodsugar, hr, gir];
                return line;
            })
            .value();

        popupController.dataExport(DataHelper.toCSV(parsed, headers));
        experimentController.triggerActivation(ActivationType.MOUSE_MONITOR, this);
    }

    getBloodGlucoseDataForPlot():PlotDataPointType[] {
        if (!this.mouseCageHasMouse()) {
            return _.map(this.graphRange, (i) => {return [i, null];});
        }
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
        if (!this.mouseCageHasMouse()) {
            return _.map(this.graphRange, (i) => {return [i, null];});
        }
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

    
    /**
     * Generates pulse data for plot graph.
     * If mouse is dead it's HR is 0.
     * if HR graph is disabled HR is null.
     */
    getHrDataForPlot():PlotDataPointType[] {
        if (!this.mouseCageHasMouse()) {
            return _.map(this.graphRange, (i) => {return [i, null];});
        }
        var hrData = [];
        hrData = _.map(this.graphRange, (i): PlotDataPointType => {
            var hr = null;

            var dataIndex = this.mouse().heartRateIndex + i;
            dataIndex = dataIndex % this.mouse().heartRateData.length;
            if (!this.mouse().alive()) {
                hr = 0;
            } else if (this.graphHrRange()[i]) {
                hr = this.mouse().heartRateData[dataIndex];
            }
            return [i, hr];
        });
        return hrData;
    }
    
    updateGraphRanges() {
        this.graphBloodRange.shift();
        if (this.isBloodSugarGraphEnabled()) {
            this.graphBloodRange.push(true);
        } else {
            this.graphBloodRange.push(false);
        }
        this.graphHrRange.shift();
        if (this.isHrGraphEnabled()) {
            this.graphHrRange.push(true);
        } else {
            this.graphHrRange.push(false);
        }
        this.graphGirRange.shift();
        if (this.isGirGraphEnabled()) {
            this.graphGirRange.push(true);
        } else {
            this.graphGirRange.push(false);
        }
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
            <PlotItemType>{
                data: this.getGirDataForPlot(),
                label: 'mmol/L',
                yaxis: 1,
                color: 'blue'},
        ];
        this.plotData.removeAll();
        this.plotData(toPlot);
    }

    addGirStepToPlotData() {
        this.girDataForPlot.shift();
        if (this.mouseCageHasMouse()) {
            this.girDataForPlot.push(this.glucoseInfusionRate());
        } else {
            this.girDataForPlot.push(null);
        }
    }
    
    nextTimeStep() {
        this.addGirStepToPlotData();
        this.updatePlotData();
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

    enter(){
        this.toggleSimulation(this.mouseCageHasMouse());
        this._mouseSubscription = this.mouse.subscribe((newmouse) => {
            this.toggleSimulation(<boolean><any>newmouse);
        });
        if (this.glucoseInfusionRate() !== null) {
            this.isHrGraphEnabled(false);
            this.isGirGraphEnabled(true);
        } else {
            this.isHrGraphEnabled(true);
            this.isGirGraphEnabled(false);
        }
    }

    dispose() {
        this.updatePlotData();
        this.toggleSimulation(false);
        this.plotData.removeAll();
        //this.plotData([]);
        if (this._mouseSubscription)
            this._mouseSubscription.dispose();
    }
}

export = VetMonitorController;
