import ko = require('knockout');
import _ = require('lodash');

import BaseViewController = require('controller/view/Base');

import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitor = require('model/interface/VetMonitor');

import MouseCage = require('model/MouseCage');

class VetMonitorBaseViewController extends BaseViewController {
    public mousecage: MouseCage;
    public vetMonitor: VetMonitor;

    public simulationInterval: KnockoutObservable<number>;
    public simulationIntervalTime: number = 100;  // millisecond

    public graphRangeStart: number = 0;
    public graphRangeEnd: number = 250;
    public graphRange: number[] = [];

    public isBloodSugarGraphEnabled: KnockoutObservable<boolean>;
    public graphBloodRange: KnockoutObservableArray<boolean>;
    //public bloodGlucoseData: KnockoutObservableArray<number[]>;

    public plotData: KnockoutObservableArray;
    
    constructor(templateName: string) {
        super(templateName);

        this.mousecage = this.gameState.mousecage;
        this.isBloodSugarGraphEnabled = ko.observable(true);
        this.graphRange = _.range(this.graphRangeStart, this.graphRangeEnd);
        this.graphBloodRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.plotData = ko.observableArray(null);

        this.simulationInterval = ko.observable(null);

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

    updateGraphRanges() {
        this.graphBloodRange.shift();
        if (this.isBloodSugarGraphEnabled()) {
            this.graphBloodRange.push(true);
        } else {
            this.graphBloodRange.push(false);
        }
    }

    toggleSimulation(enabled: boolean) {
        if (enabled) {
            this.simulationInterval(setInterval(this.nextTimeStep,
                                                this.simulationIntervalTime));
        } else {
            clearInterval(this.simulationInterval());
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
        //this.plotData.removeAll();
        this.plotData(toPlot);
    }

    nextTimeStep() {
        //if (this.mousecage.hasMouse())
        this.updatePlotData();
    }

    enter() {
        super.enter();

        this.toggleSimulation(this.mousecage.hasMouse());
    }

    exit() {
        this.toggleSimulation(false);
        this.plotData = ko.observableArray(null);
    }
}

export = VetMonitorBaseViewController;