import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');
import CompositeContainerController = require('controller/CompositeContainer');

import gameState = require('model/GameState');
import CentrifugeModel = require('model/Centrifuge');

import TubeModel = require('model/Tube');
import ClumpedCellsModel = require('model/ClumpedCells');

import LiquidType = require('model/type/Liquid');
import TubeExtractionType = require('model/type/TubeExtraction');

import ContainerFactory = require('factory/Container');
import LiquidFactory = require('factory/Liquid');

class CentrifugeController extends CompositeContainerController {

    public compContainer: CentrifugeModel;

    constructor(centrifugeModel: CentrifugeModel) {
        super(centrifugeModel);

        ko.rebind(this);
    }

    validateBalance() {
        var slot0 = this.compContainer.get(0);
        var slot1 = this.compContainer.get(1);
        var slot2 = this.compContainer.get(2);
        var slot3 = this.compContainer.get(3);

        // Are tubes in valid positions
        if (!slot0 !== !slot2 || !slot1 !== !slot3)
            return false;

        // Is slot0 and slot2 both full or empty
        if (slot0 && slot2 && (!slot0.isEmpty() !== !slot2.isEmpty()))
            return false;

        // Is slot1 and slot3 both full or empty
        if (slot1 && slot3 && (!slot1.isEmpty() !== !slot3.isEmpty()))
            return false;

        return true;
    }

    tryExtractContents(tube: TubeModel) {
        if (!tube || tube.isEmpty())
            return;

        if (tube.contains(LiquidType.CLUMPED_CELLS)) {
            popupController.tubeExtraction(TubeExtractionType.FROM_CLUMPED_CELLS)
                .then((selected: LiquidType) => {
                    var cc = <ClumpedCellsModel>tube.findByType(LiquidType.CLUMPED_CELLS);
                    var extraction = ContainerFactory.tube();

                    switch (selected) {
                    case LiquidType.FREE_FLOATING_DNA:
                        extraction.add(LiquidFactory.freeFloatingDNA(cc.bloodType()));
                        break;
                    default:
                        throw 'Invalid selected extraction';
                    }

                    gameState.inventory.add(extraction);
                    this.compContainer.removeContainer(tube);
                });
        }
        else if (tube.contains(LiquidType.MOUSE_BLOOD)) {
            popupController.tubeExtraction(TubeExtractionType.FROM_MOUSE_BLOOD)
                .then((selected: LiquidType) => {
                    var blood = tube.findByType(LiquidType.MOUSE_BLOOD);
                    var extraction = ContainerFactory.tube();

                    switch (selected) {
                    case LiquidType.BUFFY_COAT:
                        extraction.add(LiquidFactory.buffyCoat(blood.subtype()));
                        break;
                    default:
                        throw 'Invalid selected extraction';
                    }

                    gameState.inventory.add(extraction);
                    this.compContainer.removeContainer(tube);
                });
        }
    }

    // TODO: this might be a bad name
    private finishActivate() {
        _.each(this.compContainer.containers(), this.tryExtractContents);

        this.compContainer.status(false);
    }

    activate() {
        if (this.compContainer.status())
            return;

        if (!this.validateBalance()) {
            popupController.message('centrifuge.unbalanced.header', 'centrifuge.unbalanced.body');
            return;
        }

        this.compContainer.status(true);

        _.delay(this.finishActivate, 2000);
    }
}

export = CentrifugeController;
