define([
    'knockout',
    'lodash',
    'base',
    'model/type/Container',
    'utils/ImageHelper',
    'utils/DragHelper'
], function (ko, _, Base, ContainerType, ImageHelper, DragHelper) {

    var CompositeContainerController = Base.extend({

        constructor: function (compContainer, dropGuard) {
            var self = this;

            self.compContainer = compContainer;
            self.dropGuard = dropGuard || _.constant(true);
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

            default:
                throw 'Unsupported container type: ' + compContainer.type();
            }

            self.dropHandler = function (position, tube) {
                if (!self.dropGuard())
                    return false;

                self.compContainer.addAt(position, tube);
            };
        },
    });

    return CompositeContainerController;
});
