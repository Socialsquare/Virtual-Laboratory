import ko = require('knockout');
import _ = require('lodash');
import VetMonitor = require('model/type/VetMonitor');
import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');


class VetMonitorBaseModel {
    public graphRangeStart: number = 0;
    public graphRangeEnd: number = 250;
    public graphRange: number[] = [];

    public graphHrRange: KnockoutObservableArray<boolean>;
    public graphBloodRange: KnockoutObservableArray<boolean>;
    public graphGirRange: KnockoutObservableArray<boolean>;
    
    public isHrGraphEnabled: KnockoutObservable<boolean>;
    public isBloodSugarGraphEnabled: KnockoutObservable<boolean>;
    public isGirGraphEnabled: KnockoutObservable<boolean>;
    
    public glucoseData: KnockoutObservableArray<number>;

    constructor () {
        this.isHrGraphEnabled = ko.observable(false);
        this.isBloodSugarGraphEnabled = ko.observable(false);
        this.isGirGraphEnabled = ko.observable(false);
        
        this.graphRange = _.range(this.graphRangeStart, this.graphRangeEnd);
        this.graphBloodRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.graphHrRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.graphGirRange =
            ko.observableArray(_.map(this.graphRange, (v) => { return false; }));
        this.glucoseData =
            ko.observableArray(_.map(this.graphRange, (v) => { return null; }));
        
        this.plotData = ko.computed(() => {
            return [];
        }
    }
    
    exportData() {
        var raw = {}; //this.plotData();
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
}

export = VetMonitorBaseModel;