import ko = require('knockout');
import utils = require('utils/utils');
import LocalizationService = require('service/Localization');
import SimpleContainerModel = require('model/SimpleContainer');
import MicrotiterWellsModel = require('model/MicrotiterWells');
import TubeModel = require('model/Tube');
import ContainerType = require('model/type/Container');
import AntigenCoatingType = require('model/type/AntigenCoating');

class Microtiterplate extends SimpleContainerModel {

    constructor(antigenCoatingType) {
        super(ContainerType.MICROTITER, Math.pow(10, 12));

        this.antigenCoating = ko.observable(antigenCoatingType || AntigenCoatingType.NONE);
        this.microtiterWells = ko.observable(new MicrotiterWellsModel(antigenCoatingType)); // For how transfer of this works, see the pipette.
        this.subtype = this.antigenCoating;
    }

    public isWellFluorescent = (index) => {
        if (this.isFluorescent())
            return true;

        return this.microtiterWells().isWellFluorescent(index);
    }

    public extractWellContents = (inventory, hideMicrotiter, popupController, wellIndex) => {

        popupController.confirm('microtiter.extract_well.header', 'microtiter.extract_well.body')
            .then(() => {
                // 1) clone microtiter contents and dilute 24x
                // 2) clone relevant well to tube
                // 3) reset relevant well in microtiter

                var clonedLiqs = this.cloneLiquids();
                clonedLiqs = utils.biology.dilute(24, clonedLiqs);

                var clonedWell = this.microtiterWells().wells()[wellIndex].clone();
                this.microtiterWells().wells()[wellIndex].reset();

                var tube = new TubeModel();
                tube.addAll(clonedLiqs);

                tube.well = clonedWell;

                inventory.add(tube, LocalizationService.text('microtiter.acquired_tube.label'));

                hideMicrotiter();
            });
    }
}

export = Microtiterplate;
