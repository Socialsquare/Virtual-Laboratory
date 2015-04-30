import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');

import SimpleContainerModel = require('model/SimpleContainer');
import SyringeModel = require('model/Syringe');
import gameState = require('model/GameState');

import ContainerType = require('model/type/Container');

import ImageHelper = require('utils/ImageHelper');
import DragHelper = require('utils/DragHelper');


class SimpleContainerController {

    public DragHelper: DragHelper;
    public simpleContainer: SimpleContainerModel;

    // Whether a placeholder should be shown in the view
    public showPlaceholder: KnockoutObservable<boolean>;

    constructor(simpleContainer) {
        this.DragHelper = DragHelper;
        this.simpleContainer = simpleContainer;

        this.showPlaceholder = ko.observable(false);
    }

    public handleContainerDrop = (item) => {

            switch (this.simpleContainer.type()) {
            case ContainerType.ELECTROPORATOR:
                if (item.type() === ContainerType.PIPETTE) {
                    if (!item.hasTip()) {
                        popupController.message('pipette.missing_tip.header', 'pipette.missing_tip.body');
                    } else if (this.simpleContainer.isEmpty()) { // 1) hvis elektro er tom --> tilføj all the things
                        item.emptyPipetteInto(this.simpleContainer);
                        popupController.notify('pipette.emptied.header', 'pipette.emptied.body', 2000);

                    } else if (!this.simpleContainer.isEmpty() && item.getTip().isEmpty()){ // 2) hvis elektro har contents && pipette er tom --> sug alt

                        // Check for contamination
                        if (item.getTip().contaminatedBy() == null || item.getTip().contaminatedBy() == this.simpleContainer) {
                            popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                            item.fillPipette(this.simpleContainer);
                        } else {
                            popupController.message('pipette.dirty_tip.header', 'pipette.dirty_tip.body');
                        }

                    } else if (!this.simpleContainer.isEmpty() && !item.getTip().isEmpty()) { // 3) hvis elektro har contents && pipette har contents --> spørg: Vil du tømme elektro og tilføje?

                        popupController.confirm('worktable1.electroporator_refill.header','worktable1.electroporator_refill.body')
                            .then(() => {
                                this.simpleContainer.clearContents();
                                item.emptyPipetteInto(this.simpleContainer);
                                popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                            });

                    }
                }
                break;
            case ContainerType.FERMENTOR_TANK:
                //TODO: test
                if (item.type() === ContainerType.SYRINGE) {

                    if(item.isEmpty()) {// 1) Check of syringe er tom? (gør intet)
                        return false;
                    } else {
                        if (this.simpleContainer.isEmpty()) {// 2) Check om syringe har contents og ferm_tank er tom (tøm kanyle)
                            item.emptySyringeInto(this.simpleContainer);
                            popupController.notify('syringe.emptied.header', 'syringe.emptied.body', 2000);
                            return true;
                        } else {// 3) Check om begge har contents og prompt brugern (tøm fermentor og kanylen efter)

                            popupController.confirm("fermentor.empty_tank.header", "fermentor.empty_tank.body")
                                .then(() => {
                                    //When accepted

                                    this.simpleContainer.clearContents();
                                    this.simpleContainer.hasRun(false); //This is used when restarting the fermentor
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
                break;
            default:
                throw 'Needs implementation';
                break;
            }
        }
}

export = SimpleContainerController;
