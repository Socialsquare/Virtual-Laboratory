import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');
import CompositeContainerController = require('controller/CompositeContainer');

import gameState = require('model/GameState');
import CentrifugeModel = require('model/Centrifuge');

import TubeModel = require('model/Tube');
import ClumpedCellsModel = require('model/ClumpedCells');

import LiquidType = require('model/type/Liquid');

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

        var extracted: TubeModel;

        if (tube.contains(LiquidType.CLUMPED_CELLS)) {
            // created free floating dna
            var cc = <ClumpedCellsModel>tube.findByType(LiquidType.CLUMPED_CELLS);

            extracted = ContainerFactory.tube()
                .add(LiquidFactory.freeFloatingDNA(cc.bloodType()));
        }
        else if (tube.contains(LiquidType.MOUSE_BLOOD)) {
            // create buffy coat
            var blood = tube.findByType(LiquidType.MOUSE_BLOOD);
            extracted = ContainerFactory.tube()
                .add(LiquidFactory.buffyCoat(blood.subtype()));
        }

        // Add the extracted content and remove the extractee
        if (extracted) {
            gameState.inventory.add(extracted);
            this.compContainer.removeContainer(tube);

            popupController.message(
                'centrifuge.extraction.header',
                'centrifuge.extraction.body'
            );
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
