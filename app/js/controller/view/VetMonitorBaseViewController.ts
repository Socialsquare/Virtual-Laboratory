import ko = require('knockout');
import _ = require('lodash');

import BaseViewController = require('controller/view/Base');

import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitor = require('model/interface/VetMonitor');

import MouseCageModel = require('model/MouseCage');
import MouseModel = require('model/Mouse');

class VetMonitorBaseViewController {
    public mouse: KnockoutObservable<MouseModel>;
    public mouseCageHasMouse: KnockoutObservable<boolean>;
    public vetMonitor: VetMonitor;

    public simulationInterval: KnockoutObservable<number>;
    public simulationIntervalTime: number = 100;  // millisecond

    public graphRangeStart: number = 0;
    public graphRangeEnd: number = 250;
    public graphRange: number[];

    public isBloodSugarGraphEnabled: KnockoutObservable<boolean>;
    public graphBloodRange: KnockoutObservableArray<boolean>;
    //public bloodGlucoseData: KnockoutObservableArray<number[]>;

    public plotData: KnockoutObservableArray;
    private _mouseSubscription = null;
    
    constructor(params) {
        console.log(params);
        if (params === undefined) return;
        this.mouse = params.mouse;  // KnockoutObservable
        this.mouseCageHasMouse = params.hasMouse;  // KnockoutObservable
        this.isBloodSugarGraphEnabled = ko.observable(true);
        this.graphRange = _.range(this.graphRangeStart, this.graphRangeEnd);
        this.graphBloodRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.plotData = ko.observableArray(null);

        this.simulationInterval = ko.observable(null);

        this.toggleSimulation(this.mouseCageHasMouse());

        ko.rebind(this);
    }

    isBloodSugarGraphEnabledToggle() {
        this.isBloodSugarGraphEnabled(!this.isBloodSugarGraphEnabled());
    }

    exportData() {
        console.log("base exportData");
    }

    /**
     * Generates blood sugar leveldata for plot graph.
     * If mouse is dead sugar level is 0.
     * if blood sugar level graph is disabled sugar level is null.
     */
    getBloodGlucoseDataForPlot():PlotDataPointType[] {
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

    updateGraphRanges() {
        this.graphBloodRange.shift();
        if (this.isBloodSugarGraphEnabled()) {
            this.graphBloodRange.push(true);
        } else {
            this.graphBloodRange.push(false);
        }
    }

    toggleSimulation(enabled: boolean) {
        if ((enabled) && (this.simulationInterval() === null)) {
            this.simulationInterval(setInterval(this.nextTimeStep,
                                                this.simulationIntervalTime));
        } else {
            clearInterval(this.simulationInterval());
            this.simulationInterval(null);
        }
    }

    updatePlotData() {
        this.updateGraphRanges();
        var toPlot =  [
            <PlotItemType> {
                data: this.getBloodGlucoseDataForPlot(),
                label: 'mmol/L',
                yaxis: 1,
                color: 'yellow'},
        ];
        this.plotData.removeAll();
        this.plotData(toPlot);
    }

    nextTimeStep() {
        if (this.mouseCageHasMouse())
            this.updatePlotData();
    }

    enter() {
        console.log("enter");
        this._mouseSubscription = this.mouse.subscribe((newmouse) => {
            this.toggleSimulation(<boolean>newmouse);
        });
    }

    dispose() {
        console.log("dispose");
        this.toggleSimulation(false);
        this.plotData.removeAll();
        this.plotData([]);
        if (this._mouseSubscription)
            this._mouseSubscription.dispose();
    }
}

export = VetMonitorBaseViewController;