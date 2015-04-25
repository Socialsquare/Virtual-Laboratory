import ko = require(    'knockout');
import _ = require('lodash');
import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');
import SpecialItemType = require('model/type/SpecialItem');


class Worktable2 extends BaseViewController {

    constructor() {
        super('worktable2');

        this.worktable2 = this.gameState.worktable2;

        this.tableSpacePetriController = new CompositeContainerController(this.worktable2.tableSpacePetri);
        this.tableSpaceMicroController = new CompositeContainerController(this.worktable2.tableSpaceMicro);
        this.tubeRackController = new CompositeContainerController(this.worktable2.tubeRack);
        this.odController = new CompositeContainerController(this.worktable2.odMachine);


        this.tableSpacePetriController.addDropGuard(this.smallPoxGuard);
        this.tableSpaceMicroController.addDropGuard(this.smallPoxGuard);
        this.tubeRackController.addDropGuard(this.smallPoxGuard);
        this.odController.addDropGuard(this.smallPoxGuard);
    }

    public handleBlenderDrop = (item) => {
        this.worktable2.blender.status(true);
        _.delay(() => {

            if(item.type() === SpecialItemType.SPLEEN) {
                var antibodies = item.antibodiesFor();
                var homogenizedSpleen = this.liquidFactory.homoSpleen(antibodies);

                this.gameState.inventory.add(this.containerFactory.tube().add(homogenizedSpleen));
                this.popupController.message('worktable2.spleen_blended.header','worktable2.spleen_blended.body');
            }

            this.worktable2.blender.status(false);

            this.experimentController.triggerActivation(this.ActivationType.BLENDER, item);
        }, 1500);
    }
}

export = Worktable2;
