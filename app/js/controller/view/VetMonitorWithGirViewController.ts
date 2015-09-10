import ko = require('knockout');
import _ = require('lodash');

import heartRateJsonData = require('json!datadir/heartRate.json');

import DataHelper = require('utils/DataHelper');

import BaseViewController = require('controller/view/Base');
import VetMonitorBaseViewController = require('controller/view/VetMonitorBaseViewController');

import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitor = require('model/interface/VetMonitor');

import VetMonitorWithGirModel = require('model/VetMonitorWithGirModel');
import MouseCage = require('model/MouseCage');


class VetMonitorWithGirViewController extends VetMonitorBaseViewController {
    
    public isGirGraphEnabled: KnockoutObservable<boolean>;
    public graphGirRange: KnockoutObservableArray<boolean>;
    public girDataForPlot: KnockoutObservableArray<number[]>;
    
    constructor(params) {
        super(params);
        this.glucoseBag = params.glucoseBag;
        this.vetMonitor = new VetMonitorWithGirModel();
        this.isGirGraphEnabled = ko.observable(true);
        this.graphGirRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.girDataForPlot =
            ko.observableArray(_.map(this.graphRange, (v) => { return null; }));

        //this.updatePlotData();
        
        ko.rebind(this);
    }
    
    isGirGraphEnabledToggle() {
        this.isGirGraphEnabled(!this.isGirGraphEnabled());
    }
    
    /**
     * Generates Glucose Infusion Rate data for plot graph.
     * If mouse is dead it's GIR is 0.
     * if HR graph is disabled GIR is null.
     */
    getGirDataForPlot():PlotDataPointType[] {
        var girDataToPlot = [];
        girDataToPlot = _.map(this.graphRange, (i): PlotDataPointType => {
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
        this.plotData(toPlot);
    }
    
    addGlucoseStepToPlotData(gir) {
        this.girDataForPlot.shift();
        this.girDataForPlot.push(gir);
    }

    nextTimeStep() {
        this.addGlucoseStepToPlotData(
            this.glucoseBag.glucoseInfusionRate());
        this.updatePlotData();
    }

    updateGraphRanges() {
        super.updateGraphRanges();
        this.graphGirRange.shift();
        if (this.isGirGraphEnabled()) {
            this.graphGirRange.push(true);
        } else {
            this.graphGirRange.push(false);
        }
    }

}

export = VetMonitorWithGirViewController;