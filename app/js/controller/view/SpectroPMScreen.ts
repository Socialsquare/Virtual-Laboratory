import ko = require('knockout');
import _ = require('lodash');

import BaseViewController = require('controller/view/Base');
import SpectroPMController = require('controller/view/SpectroPM');

import utils = require('utils/utils');
import DataHelper = require('utils/DataHelper');
import LocalizationService = require('service/Localization');

import LiquidFactory = require('factory/Liquid');
import TubeModel = require('model/Tube');
import LiquidType  = require('model/type/Liquid');

class SpectroPMScreen extends BaseViewController {

    public spectropmController: SpectroPMController;

    constructor(spectropmController: SpectroPMController) {
        super('spectropmscreen');

        this.spectropmController = spectropmController;

        ko.rebind(this);
    }

    exportData() {
        var raw = this.spectropmController.plotData();
        var headers = ['log(conc)', 'affinity']; //TODO: i18n
        var parsed = _(raw.affinityData)
            .map((row) => [row[0], row[1]])
            .value();

        this.popupController.dataExport(DataHelper.toCSV(parsed, headers));
    }
}

export = SpectroPMScreen;
