import ko = require('knockout');
import VetMonitor = require('model/type/VetMonitor');
import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitorBaseModel = require('model/VetMonitorBaseModel');


class VetMonitorWithGirModel implements VetMonitor extends VetMonitorBaseModel {
    public hasExportButton: KnockoutObservable<boolean>;
    public hasHartRateButton: KnockoutObservable<boolean>;
    public hasBloodSugarButton: KnockoutObservable<boolean>;
    public hasGlucoseInfusionRateButton: KnockoutObservable<boolean>;
    public plotData: KnockoutComputed<PlotItemType[]>;
    public bloodGlucoseData: KnockoutObservable<PlotDataPointType[]>;
    public glucoseInfusionRateData: KnockoutObservable<PlotDataPointType[]>;

    constructor () {
        super();
        this.hasExportButton = ko.observable(true);
        this.hasHartRateButton = ko.observable(false);
        this.hasBloodSugarButton = ko.observable(true);
        this.hasGlucoseInfusionRateButton = ko.observable(true);
        
        this.isHrGraphEnabled = ko.observable(false);
        this.isBloodSugarGraphEnabled = ko.observable(true);
        this.isGirGraphEnabled = ko.observable(true);

    }
}

export = VetMonitorModel;