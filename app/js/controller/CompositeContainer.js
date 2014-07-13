define([
    'knockout',
    'base',
    'model/type/Container',
    'utils/ImageHelper',
    'utils/DragHelper'
], function (ko, Base, ContainerType, ImageHelper, DragHelper) {

    var CompositeContainerController = Base.extend({

        constructor: function (compContainer) {
            var self = this;

            self.compContainer = compContainer;

            switch (compContainer.type()) {
            case ContainerType.PETRI_SPACE:
                self.imageGetter = ImageHelper.tableSpacePetriImage;
                self.accepter = DragHelper.acceptPetri;
                break;

            case ContainerType.TUBE_RACK:
                self.imageGetter = ImageHelper.tubeRackImage;
                self.accepter = DragHelper.acceptTube;
                break;

            case ContainerType.MICRO_SPACE:
                self.imageGetter = ImageHelper.tableSpaceMicroImage;
                self.accepter = DragHelper.acceptMicro;
                break;

            case ContainerType.HEATER:
                self.imageGetter = ImageHelper.heaterTubeImage;
                self.accepter = DragHelper.acceptTube;
                break;

            default:
                throw 'Unsupported container type: ' + compContainer.type();
            }

            self.dropHandler = function (position, tube) {
                self.compContainer.addAt(position, tube);
            };
        },
    });

    return CompositeContainerController;
});
