import gameState = require('model/GameState');
import popupController = require('controller/Popup');

import SimpleContainerController = require('controller/SimpleContainer');

import SyringeModel = require('model/Syringe');
import FermentorTankModel = require('model/FermentorTank');

import ContainerType = require('model/type/Container');

class FermentorTank extends SimpleContainerController<FermentorTankModel> {

    constructor(fermentorTank: FermentorTankModel) {
        super(fermentorTank);
    }

    handleContainerDrop(item) {
        //TODO: test
        if (item.type() === ContainerType.SYRINGE) {
            // 1) Check of syringe er tom? (gør intet)
            if (item.isEmpty())
                return false;

            // 2) Check om syringe har contents og ferm_tank er tom (tøm kanyle)
            if (this.simpleContainer.isEmpty()) {
                item.emptySyringeInto(this.simpleContainer);
                popupController.notify('syringe.emptied.header', 'syringe.emptied.body', 2000);
                return true;
            }

            // 3) Check om begge har contents og prompt brugern (tøm fermentor og kanylen efter)
            popupController.confirm('fermentor.empty_tank.header', 'fermentor.empty_tank.body').then(() => {
                this.simpleContainer.clearContents();
                //This is used when restarting the fermentor
                this.simpleContainer.hasRun(false);
                item.emptySyringeInto(this.simpleContainer);
                gameState.fermentor.resetContents();
                popupController.notify('syringe.emptied.header', 'syringe.emptied.body', 2000);
            }).fail(() => {
                //When rejected
                var clonedLiqs = item.cloneLiquids();
                var clonedSyringe = new SyringeModel();
                clonedSyringe.liquids(clonedLiqs);
                gameState.inventory.add(clonedSyringe);
            });
        }
    }
}

export = FermentorTank;
