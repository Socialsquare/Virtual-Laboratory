import ko = require('knockout');
import _ = require('lodash');

import utils = require('utils/utils');

import popupController = require('controller/Popup');

import ContainerType = require('model/type/Container');
import SpecialItemType = require('model/type/SpecialItem');
import AntigenCoatingType = require('model/type/AntigenCoating');

import CompositeContainerModel = require('model/CompositeContainer');

import LiquidFactory = require('factory/Liquid');

import ImageHelper = require('utils/ImageHelper');
import DragHelper = require('utils/DragHelper');


class CompositeContainerController {

    public DragHelper: DragHelper;

    public compContainer: CompositeContainerModel;

    public dropGuards: ((pos, container) => any)[];
    public showPlaceholder: KnockoutObservable<boolean>;

    constructor(compContainer) {

        this.DragHelper = DragHelper;
        this.compContainer = compContainer;

        // defaults
        // guard-functions that should always take 2 parameters: dropGuard(position, container)
        this.dropGuards = [];
        this.showPlaceholder = ko.observable(false);

        switch (compContainer.type()) {
        case ContainerType.PETRI_SPACE:
            this.showPlaceholder(true);

            this.imageGetter = ImageHelper.tableSpacePetriImage;
            this.accepter = DragHelper.acceptPetri;
            break;

        case ContainerType.MICRO_SPACE:
            this.showPlaceholder(true);

            this.imageGetter = ImageHelper.tableSpaceMicroImage;
            this.accepter = DragHelper.acceptMicro;
            break;

        case ContainerType.TUBE_RACK:
            this.imageGetter = ImageHelper.tubeRackImage;
            this.accepter = DragHelper.acceptTube;
            break;

        case ContainerType.HEATER:
            this.imageGetter = ImageHelper.heaterTubeImage;
            this.accepter = DragHelper.acceptTube;
            break;

        case ContainerType.SPECTROPM_MACHINE:
            this.showPlaceholder(false);

            this.imageGetter = ImageHelper.spectroPMMicroSlotImage;
            this.accepter = DragHelper.acceptMicro;
            break;

        case ContainerType.OD_MACHINE:
            this.imageGetter = ImageHelper.odMachineTubeImage;
            this.accepter = DragHelper.acceptTube;
            break;

        case ContainerType.UV_TUBE_RACK:
            this.imageGetter = ImageHelper.uvTubeRackImage;
            this.accepter = DragHelper.acceptTube;
            break;

        case ContainerType.UV_PETRI_SPACE:
            this.showPlaceholder(true);

            this.imageGetter = ImageHelper.uvTableSpacePetriImage;
            this.accepter = DragHelper.acceptPetri;
            break;

        case ContainerType.UV_MICRO_SPACE:
            this.showPlaceholder(true);

            this.imageGetter = ImageHelper.uvTableSpaceMicroImage;
            this.accepter = DragHelper.acceptMicro;
            break;

        default:
            throw 'Unsupported container type: ' + compContainer.type();
        }
    }

    public addDropGuard = (dropGuard) => {
        this.dropGuards.push(dropGuard);
    }

    public dropHandler = (position, container) => {
        if (this.dropGuards.length > 0) {
            // if ANY dropGuard says no-go, then return false
            if (_.any(this.dropGuards, (dropGuard) => !dropGuard(position, container)))
                return false;
        }

        this.compContainer.addAt(position, container);

        return true;
    }

    public handleContainerDrop = (position, item) => {
        switch(item.type()) {
        case ContainerType.PIPETTE:

            if (!item.hasTip()) {
                popupController.message('pipette.missing_tip.header', 'pipette.missing_tip.body');

            } else if (item.getTip().isEmpty()) {

                // Check for contamination
                if (!this.compContainer.get(position).isEmpty()
                   && (item.getTip().contaminatedBy() == null || item.getTip().contaminatedBy() == this.compContainer.get(position))) {

                    popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                    item.fillPipette(this.compContainer.get(position));
                } else {
                    popupController.message('pipette.dirty_tip.header', 'pipette.dirty_tip.body');
                }
                /*
                //TODO: check if the current container is equal to the "contaminatedBy()" else if "null" just take the stuff
                if(item.getTip().used())  {
                popupController.message('pipette.dirty_tip.header', 'pipette.dirty_tip.body');
                } else if (! this.compContainer.get(position).isEmpty()) {
                item.fillPipette(this.compContainer.get(position));
                popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                }*/
            } else {
                item.emptyPipetteInto(this.compContainer.get(position));
                popupController.notify('pipette.emptied.header', 'pipette.emptied.body', 2000);
            }
            break;

        case ContainerType.SYRINGE:
            if (item.isEmpty()) {
                item.fillSyringe(this.compContainer.get(position));
                popupController.notify('syringe.filled.header', 'syringe.filled.body', 2000);
                return false;
            } else {
                item.emptySyringeInto(this.compContainer.get(position));
                popupController.notify('syringe.emptied.header', 'syringe.emptied.body', 2000);
                return true;
            }
            break;

        case SpecialItemType.WASH_BOTTLE:
            this.compContainer.get(position).add(LiquidFactory.saltWater());
            popupController.notify('wash_bottle.diluted.header', 'wash_bottle.diluted.body', 2000);
            return false;
            break;

        case SpecialItemType.BUFFER:
            switch(this.compContainer.get(position).type()) {
            case ContainerType.TUBE:
                popupController.notify('buffer_tube.header', 'buffer_tube.body');
                break;
            case ContainerType.PETRI_DISH:
                popupController.notify('buffer_petri.header', 'buffer_petri.body');
                break;
            case ContainerType.MICROTITER:
                var microtiter = this.compContainer.get(position);

                this.compContainer.get(position).add(LiquidFactory.buffer());

                this.compContainer.get(position).clearContents();
                if (microtiter.antigenCoating() === AntigenCoatingType.NONE) {
                    microtiter.microtiterWells().clearWellsAntibodies();
                    microtiter.microtiterWells().clearWellsSecondaryAntibodies(false);

                } else {
                    //Let the wells of the microtiter plate keep their antibodies, and 2ndary, but ONLY if it has antibodies!
                    microtiter.microtiterWells().clearWellsSecondaryAntibodies(true);

                }

                return false;
            }

            break;

        default:
            break;
        }
    }

    public goToCloseUp = (index, item) => {
        if (item.type() !== ContainerType.MICROTITER)
            return;

        popupController.microtiterCloseUp(item);
    }
}

export = CompositeContainerController;
