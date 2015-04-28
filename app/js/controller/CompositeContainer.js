define([
    'knockout',
    'lodash',
    'base',
    'utils/utils',

    'controller/Popup',

    'model/type/Container',
    'model/type/SpecialItem',
    'model/type/AntigenCoating',

    'factory/Liquid',

    'utils/ImageHelper',
    'utils/DragHelper'

], function (ko, _, Base, utils, popupController, ContainerType, SpecialItemType, AntigenCoatingType,
             LiquidFactory, ImageHelper, DragHelper) {

    var CompositeContainerController = Base.extend({

        constructor: function (compContainer) {
            var self = this;

            self.DragHelper = DragHelper;
            self.popupController = popupController;
            self.compContainer = compContainer;

            // defaults
            self.dropGuards = []; // guard-functions that should always take 2 parameters: dropGuard(position, container)
            self.showPlaceholder = ko.observable(false);

            switch (compContainer.type()) {
            case ContainerType.PETRI_SPACE:
                self.showPlaceholder(true);

                self.imageGetter = ImageHelper.tableSpacePetriImage;
                self.accepter = DragHelper.acceptPetri;
                break;

            case ContainerType.MICRO_SPACE:
                self.showPlaceholder(true);

                self.imageGetter = ImageHelper.tableSpaceMicroImage;
                self.accepter = DragHelper.acceptMicro;
                break;

            case ContainerType.TUBE_RACK:
                self.imageGetter = ImageHelper.tubeRackImage;
                self.accepter = DragHelper.acceptTube;
                break;

            case ContainerType.HEATER:
                self.imageGetter = ImageHelper.heaterTubeImage;
                self.accepter = DragHelper.acceptTube;
                break;

            case ContainerType.SPECTROPM_MACHINE:
                self.showPlaceholder(false);

                self.imageGetter = ImageHelper.spectroPMMicroSlotImage;
                self.accepter = DragHelper.acceptMicro;
                break;

            case ContainerType.OD_MACHINE:
                self.imageGetter = ImageHelper.odMachineTubeImage;
                self.accepter = DragHelper.acceptTube;
                break;

            case ContainerType.UV_TUBE_RACK:
                self.imageGetter = ImageHelper.uvTubeRackImage;
                self.accepter = DragHelper.acceptTube;
                break;

            case ContainerType.UV_PETRI_SPACE:
                self.showPlaceholder(true);

                self.imageGetter = ImageHelper.uvTableSpacePetriImage;
                self.accepter = DragHelper.acceptPetri;
                break;

            case ContainerType.UV_MICRO_SPACE:
                self.showPlaceholder(true);

                self.imageGetter = ImageHelper.uvTableSpaceMicroImage;
                self.accepter = DragHelper.acceptMicro;
                break;

            default:
                throw 'Unsupported container type: ' + compContainer.type();
            }

            self.addDropGuard = function(dropGuard) {
                self.dropGuards.push(dropGuard);
            };

            self.dropHandler = function (position, container) {
                if (self.dropGuards.length > 0) { // Means that there are guards to check

                    // if ANY dropGuard says no-go, then return false
                    if(_.any(self.dropGuards, function(dropGuard){ return !dropGuard(position, container); }))
                        return false;
                }

                self.compContainer.addAt(position, container);

                return true;
            };

            self.handleContainerDrop = function (position, item) {
                switch(item.type()) {
                    case ContainerType.PIPETTE:

                        if (!item.hasTip()) {
                            self.popupController.message('pipette.missing_tip.header', 'pipette.missing_tip.body');

                        }else if(item.getTip().isEmpty()) {

                            // Check for contamination
                            if(! self.compContainer.get(position).isEmpty()
                                    && (item.getTip().contaminatedBy() == null || item.getTip().contaminatedBy() == self.compContainer.get(position))) {

                                self.popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                                item.fillPipette(self.compContainer.get(position));
                            }else {
                                self.popupController.message('pipette.dirty_tip.header', 'pipette.dirty_tip.body');
                            }
/*
                            //TODO: check if the current container is equal to the "contaminatedBy()" else if "null" just take the stuff
                            if(item.getTip().used())  {
                                self.popupController.message('pipette.dirty_tip.header', 'pipette.dirty_tip.body');
                            } else if (! self.compContainer.get(position).isEmpty()) {
                                item.fillPipette(self.compContainer.get(position));
                                self.popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                            }*/
                        }else {
                            item.emptyPipetteInto(self.compContainer.get(position));
                            self.popupController.notify('pipette.emptied.header', 'pipette.emptied.body', 2000);
                        }
                        break;

                    case ContainerType.SYRINGE:
                        if (item.isEmpty()) {
                            item.fillSyringe(self.compContainer.get(position));
                            self.popupController.notify('syringe.filled.header', 'syringe.filled.body', 2000);
                            return false;
                        }else {
                            item.emptySyringeInto(self.compContainer.get(position));
                            self.popupController.notify('syringe.emptied.header', 'syringe.emptied.body', 2000);
                            return true;
                        }
                        break;

                    case SpecialItemType.WASH_BOTTLE:
                        self.compContainer.get(position).add(LiquidFactory.saltWater());
                        self.popupController.notify('wash_bottle.diluted.header', 'wash_bottle.diluted.body', 2000);
                        return false;
                        break;

                    case SpecialItemType.BUFFER:
                        switch(self.compContainer.get(position).type()) {
                            case ContainerType.TUBE:
                                self.popupController.notify('buffer_tube.header', 'buffer_tube.body');
                                break;
                            case ContainerType.PETRI_DISH:
                                self.popupController.notify('buffer_petri.header', 'buffer_petri.body');
                                break;
                            case ContainerType.MICROTITER:
                                var microtiter = self.compContainer.get(position);

                                self.compContainer.get(position).add(LiquidFactory.buffer());

                                self.compContainer.get(position).clearContents();
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
            };

            self.goToCloseUp = function(index, item) {
                console.log('TODO: remove. ItemType: '+item.type()+', ItemLocation: '+item.location()+', Total concentration in item #'+ index +': ' + item.getTotalConcentration());

                if (item.type() !== ContainerType.MICROTITER)
                    return;

                self.popupController.microtiterCloseUp(item);
            };
        }
    });

    return CompositeContainerController;
});
