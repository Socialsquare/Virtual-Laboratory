import ko = require('knockout');
import VetMonitor = require('model/type/VetMonitor');
import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitorBaseModel = require('model/VetMonitorBaseModel');


class VetMonitorModel implements VetMonitor extends VetMonitorBaseModel {
    public plotData: KnockoutComputed<PlotItemType[]>;
    public heartRateData: KnockoutObservable<PlotDataPointType[]>;
    public bloodGlucoseData: KnockoutObservable<PlotDataPointType[]>;

    constructor () {
        super();
        this.isHrGraphEnabled = ko.observable(false);
        this.isBloodSugarGraphEnabled = ko.observable(true);
        this.isGirGraphEnabled = ko.observable(false);
        

    }
}

export = VetMonitorModel;