import ko = require(    'knockout');
import _ = require('lodash');

import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');
import CentrifugeController = require('controller/Centrifuge');
import VideoController = require('controller/Video');

import ActivationType = require('model/type/Activation');
import SpecialItemType = require('model/type/SpecialItem');
import gameState = require('model/GameState');
import Worktable2Model = require('model/Worktable2');

class Worktable2 extends BaseViewController {

    public worktable2: Worktable2Model;
    public tableSpacePetriController: CompositeContainerController;
    public tableSpaceMicroController: CompositeContainerController;
    public tubeRackController: CompositeContainerController;
    public odController: CompositeContainerController;
    public centrifugeController: CentrifugeController;
    public videoController: VideoController;

    constructor() {
        super('worktable2');

        this.worktable2 = gameState.worktable2;

        this.tableSpacePetriController = new CompositeContainerController(this.worktable2.tableSpacePetri);
        this.tableSpaceMicroController = new CompositeContainerController(this.worktable2.tableSpaceMicro);
        this.tubeRackController = new CompositeContainerController(this.worktable2.tubeRack);
        this.odController = new CompositeContainerController(this.worktable2.odMachine);
        this.centrifugeController = new CentrifugeController(this.worktable2.centrifuge);
        this.videoController = new VideoController(true);

        this.tableSpacePetriController.addDropGuard(this.smallPoxGuard);
        this.tableSpaceMicroController.addDropGuard(this.smallPoxGuard);
        this.tubeRackController.addDropGuard(this.smallPoxGuard);
        this.odController.addDropGuard(this.smallPoxGuard);
        this.centrifugeController.addDropGuard(this.smallPoxGuard);

        ko.rebind(this);
    }

    performBlending(item) {
        if (item.type() === SpecialItemType.SPLEEN) {
            var antibodies = item.antibodiesFor();
            var homogenizedSpleen = this.liquidFactory.homoSpleen(antibodies);

            gameState.inventory.add(this.containerFactory.tube().add(homogenizedSpleen));
            this.popupController.message('worktable2.spleen_blended.header', 'worktable2.spleen_blended.body');
        }

        this.worktable2.blender.status(false);

        this.experimentController.triggerActivation(ActivationType.BLENDER, item);
    }

    handleBlenderDrop(item) {
        this.worktable2.blender.status(true);
        this.videoController.play('blender-shake', false);

        _.delay(this.performBlending, 3000, item);
    }

    activateCentrifuge() {
        this.centrifugeController.activate();
    }
}

export = Worktable2;
