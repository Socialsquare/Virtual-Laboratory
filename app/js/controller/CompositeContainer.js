define([
    'knockout',
    'lodash',
    'base',

    'controller/Popup',

    'model/type/Container',

    'utils/ImageHelper',
    'utils/DragHelper'
], function (ko, _, Base, popupController, ContainerType, ImageHelper, DragHelper) {

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

            case ContainerType.UV:
                self.imageGetter = ImageHelper.uvTubeImage;
                self.accepter = DragHelper.acceptTube;
                break;

            case ContainerType.OD_MACHINE:
                self.imageGetter = ImageHelper.odMachineTubeImage;
                self.accepter = DragHelper.acceptTube;
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
                        self.popupController.message('Dumt', 'Der er ingen spids på pipetten');
                    }else {
//TODO: such implementation
                        alert('Pipettespids på: ' +self.compContainer.get(position).type());
                    }
                }
            };
        },
    });

    return CompositeContainerController;
});