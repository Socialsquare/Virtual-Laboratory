import ko = require('knockout');
import VetMonitor = require('model/interface/VetMonitor');
import PlotItemType = require('model/type/PlotItemType');
import PlotDataPointType = require('model/type/PlotDataPointType');
import VetMonitorBaseModel = require('model/VetMonitorBaseModel');


class VetMonitorWithGirModel extends VetMonitorBaseModel implements VetMonitor {

    constructor () {
        super();
    }
}

export = VetMonitorWithGirModel;