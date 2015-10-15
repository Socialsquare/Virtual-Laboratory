import ko = require('knockout');
import _ = require('lodash');

import heartRateJsonData = require('json!datadir/heartRate.json');
import DataHelper = require('utils/DataHelper');

//import popupController = require('controller/Popup');
import experimentController = require('controller/Experiment');

import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');
import ActivationType = require('model/type/Activation');
import MouseModel = require('model/Mouse');
import vetMonitorLog = require('service/VetMonitorLog');
import VetMonitorLogItem = require('model/type/VetMonitorLogItem');
import VetMonitorExportPopup = require('controller/view/VetMonitorExportPopup');


class VetMonitor {
    public mouse: KnockoutObservable<MouseModel>;
    public mouseHeartRate: KnockoutObservable<number>;
    public mouseBloodSugar: KnockoutObservable<number>;
    public mouseCageHasMouse: KnockoutComputed<boolean>;
    public glucoseInfusionRate: KnockoutObservable<number>;

    public simulationInterval: number = null
    public simulationIntervalTime: number = 100;  // millisecond
    private _saveCurrentDataCounter = 0;
    private _saveCurrentDataRate = 5;

    public graphRangeStart: number = 0;
    public graphRangeEnd: number = 250;
    public graphRange: number[];
    
    public shouldShowExportPopup: KnockoutObservable<boolean>;

    public isBloodSugarGraphEnabled: KnockoutObservable<boolean>;
    public graphBloodRange: KnockoutObservableArray<boolean>;
    //public bloodGlucoseData: KnockoutObservableArray<number>;

    public isGirGraphEnabled: KnockoutObservable<boolean>;
    public graphGirRange: KnockoutObservableArray<boolean>;

    public girDataForPlot: KnockoutObservableArray<number>;
    public bloodGlucoseDataForPlot: KnockoutObservableArray<number>;
    
    public isHrGraphEnabled: KnockoutObservable<boolean>;
    public graphHrRange: KnockoutObservableArray<boolean>;
    //public heartRateData: KnockoutObservableArray<number>;

    public plotData: KnockoutObservableArray<any>;
    private _mouseSubscription = null;

    constructor(params) {
        console.log('VetMonitorController()');
        console.log(params);
        if (params === undefined) return;
        this.mouse = params.mouse;  // KnockoutObservable
        this.mouseCageHasMouse = params.hasMouse;  // KnockoutObservable
        
        this.shouldShowExportPopup = ko.observable(false);
        this.mouseHeartRate = ko.observable(null);
        this.mouseBloodSugar = ko.observable(null);
        
        if (params.glucoseInfusionRate === null){
            this.glucoseInfusionRate = ko.observable(null);
        } else {
            this.glucoseInfusionRate = params.glucoseInfusionRate;  // KnockoutObservable
        }
        
        this.isBloodSugarGraphEnabled = ko.observable(true);
        this.graphRange = _.range(this.graphRangeStart, this.graphRangeEnd);
        
        this.isHrGraphEnabled = ko.observable(false);
        this.isGirGraphEnabled = ko.observable(true);
        
        if (this.glucoseInfusionRate() !== null) {
            this.isHrGraphEnabled(false);
            this.isGirGraphEnabled(true);

        } else {
            this.isHrGraphEnabled(true);
            this.isGirGraphEnabled(false);
        }

        this.girDataForPlot =
            ko.observableArray(_.map(this.graphRange, (v) => { return null; }));
        this.bloodGlucoseDataForPlot =
            ko.observableArray(_.map(this.graphRange, (v) => { return null; }));

        this.plotData = ko.observableArray(null);
        this.graphGirRange = ko.observableArray([]);
        this.graphHrRange = ko.observableArray([]);
        this.graphBloodRange = ko.observableArray([]);
        
        ko.rebind(this);
    }
    
    public resetGraphRanges = () => {
        console.log("resetGraphRanges");
        this.graphGirRange.removeAll();
        _.map(this.graphRange, (v) => { this.graphGirRange.push(false); });

        this.graphHrRange.removeAll();
        _.map(this.graphRange, (v) => { this.graphHrRange.push(false); });

        this.graphBloodRange.removeAll();
        _.map(this.graphRange, (v) => { this.graphBloodRange.push(false); });
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
        this.shouldShowExportPopup(true);
        experimentController.triggerActivation(ActivationType.MOUSE_MONITOR, this);
    }

    getBloodGlucoseDataForPlot(): PlotDataPointType[] {
        if (!this.mouseCageHasMouse()) {
            return _.map(this.graphRange, (i): PlotDataPointType => {
                return [i, null];
            });
        }
        var bloodData = _.map(this.graphRange, (i): PlotDataPointType => {
            var sugar = null;
            if (!this.mouse().alive()) {
                sugar = 0;
            } else if (this.graphBloodRange()[i]) {
                sugar = this.bloodGlucoseDataForPlot()[i];
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
    getGirDataForPlot(): PlotDataPointType[] {
        if (!this.mouseCageHasMouse()) {
            return _.map(this.graphRange, (i): PlotDataPointType => {
                return [i, null];
            });
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
    getHrDataForPlot(): PlotDataPointType[] {
        if (!this.mouseCageHasMouse()) {
            return _.map(this.graphRange, (i): PlotDataPointType => {
                return [i, null];
            });
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
        var toPlot = [
            <PlotItemType>{
                data: this.getHrDataForPlot(),
                yaxis: 2,
                color: 'rgb(255,160,160)'
            },
            <PlotItemType>{
                data: this.getBloodGlucoseDataForPlot(),
                label: 'mmol/L',
                yaxis: 1,
                color: 'yellow'
            },
            <PlotItemType>{
                data: this.getGirDataForPlot(),
                label: 'mmol/L',
                yaxis: 1,
                color: 'blue'
            },
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

    addBloodGlucoseStepToPlotData() {
        this.bloodGlucoseDataForPlot.shift();
        if (this.mouseCageHasMouse()) {
            this.bloodGlucoseDataForPlot.push(this.mouseBloodSugar());
        } else {
            this.bloodGlucoseDataForPlot.push(null);
        }
    }

    saveCurrentData() {
        // saves data less frequently than time interval
        if (this._saveCurrentDataCounter < this._saveCurrentDataRate) {
            this._saveCurrentDataCounter += 1;
            return;
        }
        this._saveCurrentDataCounter = 0;
        var chunk = <VetMonitorLogItem>{
            logId: null,
            time: (new Date()).toISOString(),
            hr: this.mouseHeartRate(),
            gl: this.mouseBloodSugar(),
            gir: this.glucoseInfusionRate()
        };
        vetMonitorLog.saveChunks([chunk, ]);
    }

    nextTimeStep() {
        this.updatePlotData();
        this.addGirStepToPlotData();
        this.addBloodGlucoseStepToPlotData();
        this.saveCurrentData();
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
        console.log("VetMonitorController enter()");
        this.resetGraphRanges();
        
        this.mouseHeartRate.subscribeTo("mouseCageMouseHeartRateTopic", true);
        this.mouseBloodSugar.subscribeTo("mouseCageMouseBloodSugarTopic", true);
        
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
        vetMonitorLog.updateLogId();
    }

    dispose() {
        console.log("VetMonitorController dispose()");
        
        this.mouseHeartRate.unsubscribeFrom("mouseCageMouseHeartRateTopic");
        this.mouseBloodSugar.unsubscribeFrom("mouseCageMouseBloodSugarTopic");
        
        this.updatePlotData();
        this.toggleSimulation(false);
        this.plotData.removeAll();
        this.girDataForPlot.removeAll();
        this.bloodGlucoseDataForPlot.removeAll();
        //this.plotData([]);
        if (this._mouseSubscription)
            this._mouseSubscription.dispose();
    }
}

export = VetMonitor;
