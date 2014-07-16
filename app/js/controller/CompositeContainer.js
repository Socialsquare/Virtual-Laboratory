define([
    'knockout',
    'lodash',
    'base',
    'utils/utils',

    'controller/Popup',

    'model/type/Container',

    'utils/ImageHelper',
    'utils/DragHelper'
], function (ko, _, Base, utils, popupController, ContainerType, ImageHelper, DragHelper) {

    var CompositeContainerController = Base.extend({

        constructor: function (compContainer) {
            var self = this;

            self.DragHelper = DragHelper;
            self.popupController = popupController;
            self.compContainer = compContainer;

            // defaults
            self.dropGuard = _.constant(true);
            self.imagePlaceholderGetter = _.constant('');
            self.showPlaceholder = ko.observable(false);

            switch (compContainer.type()) {
            case ContainerType.PETRI_SPACE:
                self.imagePlaceholderGetter = ImageHelper.tableSpacePetriPlaceholderImage;
                self.showPlaceholder(true);

                self.imageGetter = ImageHelper.tableSpacePetriImage;
                self.accepter = DragHelper.acceptPetri;
                break;

            case ContainerType.MICRO_SPACE:
                self.imagePlaceholderGetter = ImageHelper.tableSpaceMicroPlaceholderImage;
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
                self.imageGetter = ImageHelper.uvTableSpacePetriImage;
                self.accepter = DragHelper.acceptPetri;
                break;

            case ContainerType.UV_MICRO_SPACE:
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
                if (item.type() === ContainerType.PIPETTE) {
                    if (!item.hasTip()) {
                        self.popupController.message('pipette.missing_tip.body', 'pipette.missing_tip.header');
                    } else if (item.getTip().isEmpty()) {
//TODO: such implementation
                        if (item.getTip().used())  {
                            self.popupController.message('pipette.dirty_tip.body', 'pipette.dirty_tip.header');
                        } else {

                            item.fillPipette(self.compContainer.get(position));
                            self.popupController.notify('pipette.sucked.header', 'pipette.sucked.body', 2000);
                        }
                    } else { //TODO: empty the pipette
                        item.emptyPipetteInto(self.compContainer.get(position));
                        self.popupController.notify('pipette.emptied.header', 'pipette.emptied.body', 2000);
                    }
                }
            };
        },
    });

    return CompositeContainerController;
});
