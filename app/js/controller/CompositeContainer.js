define([
    'knockout',
    'lodash',
    'base',
    'utils/utils',

    'controller/Popup',

    'model/type/Container',
    'model/type/SpecialItem',

    'factory/Liquid',

    'utils/ImageHelper',
    'utils/DragHelper',
    'utils/utils'

], function (ko, _, Base, utils, popupController, ContainerType, SpecialItemType,
             LiquidFactory, ImageHelper, DragHelper, utils) {

    var CompositeContainerController = Base.extend({

        constructor: function (compContainer) {
            var self = this;

            self.DragHelper = DragHelper;
            self.popupController = popupController;
            self.compContainer = compContainer;

            // defaults
            self.dropGuard = _.constant(true);
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

            self.dropHandler = function (position, tube) {
                if (!self.dropGuard())
                    return false;

                self.compContainer.addAt(position, tube);

                return true;
            };

            self.handleContainerDrop = function (position, item) {
                switch(item.type()) {
                    case ContainerType.PIPETTE:

                        if (!item.hasTip()) {
                            self.popupController.message('pipette.missing_tip.header', 'pipette.missing_tip.body');

                        }else if(item.getTip().isEmpty()) {

                            if(item.getTip().used())  {
                                self.popupController.message('pipette.dirty_tip.header', 'pipette.dirty_tip.body');
                            } else if (! self.compContainer.get(position).isEmpty()) {
                                item.fillPipette(self.compContainer.get(position));
                                self.popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                            }
                        }else {
                            //TODO: check
                            console.log('TODO: can add content'+self.compContainer.get(position).canAddLiquids(item.getTip().liquids()));
                            item.emptyPipetteInto(self.compContainer.get(position)); //TODO: search for more usages
                            self.popupController.notify('pipette.emptied.header', 'pipette.emptied.body', 2000);
                        }
                        break;

                    case ContainerType.SYRINGE:
                        if (item.isEmpty()) {
                            item.fillSyringe(self.compContainer.get(position));
                            self.popupController.notify('syringe.filled.header', 'syringe.filled.body', 2000);
                            return false;
                        }else {
                            //TODO: check
                            console.log('TODO: can add content'+self.compContainer.get(position).canAddLiquids(item.liquids()));
                            item.emptySyringeInto(self.compContainer.get(position)); //TODO: search for more usages
                            self.popupController.notify('syringe.emptied.header', 'syringe.emptied.body', 2000);
                            return true;
                        }
                        break;

                    case SpecialItemType.WASH_BOTTLE:
                        self.compContainer.get(position).add(LiquidFactory.saltWater());
                        self.popupController.notify('wash_bottle.diluted.header', 'wash_bottle.diluted.body', 2000);
                        return false;
                        break;

                    default:
                        break;
                }
            };

            self.goToCloseUp = function(index, item) {
                console.log('TODO: remove. Total concentration in item #'+ index +': ' + item.getTotalConcentration());

                if (item.type() !== ContainerType.MICROTITER)
                { return; }

                self.popupController.microtiterCloseUp (item);
            };
        }
    });

    return CompositeContainerController;
});
