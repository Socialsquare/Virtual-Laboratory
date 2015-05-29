import ko = require('knockout');

import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');

import IncubatorModel = require('model/Incubator');

class IncubatorController extends BaseViewController {

    public incubator: IncubatorModel;

    public tubeRackController: CompositeContainerController;
    public petriSpaceController: CompositeContainerController;

    constructor() {
        super('incubator');

        this.incubator = this.gameState.incubator;

        this.tubeRackController = new CompositeContainerController(this.incubator.tubeRack);
        this.tubeRackController.imageGetter = this.ImageHelper.incubatorTubeImage;
        this.tubeRackController.addDropGuard(this.smallPoxGuard);

        this.petriSpaceController = new CompositeContainerController(this.incubator.tableSpacePetri);
        this.petriSpaceController.imageGetter = this.ImageHelper.incubatorPetriImage;
        this.petriSpaceController.addDropGuard(this.smallPoxGuard);

        ko.rebind(this);
    }

    changeTemp(val: number) {
        this.incubator.temperature(this.incubator.temperature() + val);
    }

    changeTimer(val: number) {
        var newVal = this.incubator.timer() + val;
        newVal = newVal < 0 ? 0 : newVal;
        this.incubator.timer(newVal);
    }

    activateIncubator() {
        this.incubator.activate();
    }
}

export = IncubatorController;
