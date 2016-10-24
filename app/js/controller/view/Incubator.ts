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
        this.tableSpaceMicroController.imageGetter = this.ImageHelper.incubatorMicroImage;
        //this.tableSpaceMicroController.addDropGuard(this.smallPoxGuard);

        ko.rebind(this);
    }

    changeTemp(tempUp: boolean = false) {
        var tempChange = tempUp ? 1 : -1;
        var newTemp = this.incubator.temperature() + tempChange;

        if (newTemp >= 17 && newTemp <= 40) {
            this.incubator.temperature(newTemp);
        }
    }

    changeTimer(timerUp: boolean = false) {
        var timeChange = timerUp ? 2 : -2;
        var newTime = this.incubator.timer() + timeChange;

        if (newTime > 0) {
            this.incubator.timer(newTime);
        }
    }

    activateIncubator() {
        this.incubator.activate();
    }

    enter() {
        super.enter();
        if (super.apparatusEnabled('INCUBATOR_ANTI_MATTER', 'INCUBATOR_ANTI_MATTER')) {
            this.incubator.timer(24);
        }
    }
}

export = IncubatorController;
