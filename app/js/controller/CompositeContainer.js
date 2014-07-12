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

            switch (compContainer.acceptedType()) {
            case ContainerType.PETRI_DISH:
                self.imageGetter = ImageHelper.tableSpacePetriImage;
                self.accepter = DragHelper.acceptPetri;
                break;

            case ContainerType.TUBE:
                self.imageGetter = ImageHelper.tubeRackImage;
                self.accepter = DragHelper.acceptTube;
                break;

            case ContainerType.MICROTITER:
                self.imageGetter = ImageHelper.tableSpaceMicroImage;
                self.accepter = DragHelper.acceptMicro;
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
