import ko = require('knockout');

import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');
import gameState = require('model/GameState');
import IncubatorModel = require('model/Incubator');

class IncubatorController extends BaseViewController {

    public incubator: IncubatorModel;

    public tubeRackController: CompositeContainerController;
    public petriSpaceController: CompositeContainerController;
    public tableSpaceMicroController: CompositeContainerController;

    constructor() {
        super('incubator');

        this.incubator = gameState.incubator;

        this.tubeRackController = new CompositeContainerController(this.incubator.tubeRack);
        this.tubeRackController.imageGetter = this.ImageHelper.incubatorTubeImage;
        this.tubeRackController.addDropGuard(this.smallPoxGuard);

        this.petriSpaceController = new CompositeContainerController(this.incubator.tableSpacePetri);
        this.petriSpaceController.imageGetter = this.ImageHelper.incubatorPetriImage;
        this.petriSpaceController.addDropGuard(this.smallPoxGuard);

        this.tableSpaceMicroController = new CompositeContainerController(this.incubator.tableSpaceMicro);
        //this.tableSpaceMicroController.addDropGuard(this.smallPoxGuard);

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

    enter() {
        super.enter();
        if (super.apparatusEnabled('INCUBATOR_ANTI_MATTER', 'INCUBATOR_ANTI_MATTER')) {
            this.incubator.timer(240);
        }
    }
}

export = IncubatorController;
