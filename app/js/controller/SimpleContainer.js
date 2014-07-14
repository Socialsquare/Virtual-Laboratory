define([
    'knockout',
    'lodash',
    'base',

    'controller/Popup',

    'model/type/Container',

    'utils/ImageHelper',
    'utils/DragHelper'
], function (ko, _, Base, popupController, ContainerType, ImageHelper, DragHelper) {

    var SimpleContainerController = Base.extend({

        constructor: function (simpleContainer) {
            var self = this;

            self.DragHelper = DragHelper;
            self.popupController = popupController;
            self.simpleContainer = simpleContainer;

            // defaults
            self.dropGuard = _.constant(true);
            self.imagePlaceholderGetter = _.constant('');
            self.showPlaceholder = ko.observable(false);

            switch (simpleContainer.type()) {
                case ContainerType.ELECTROPORATOR:
                    self.imagePlaceholderGetter = ImageHelper.tableSpacePetriPlaceholderImage;
                    self.showPlaceholder(true);

                    self.imageGetter = ImageHelper.tableSpacePetriImage;
                    self.accepter = DragHelper.acceptPetri;
                    break;

                default:
                    throw 'Unsupported container type: ' + simpleContainer.type();
            }

            self.dropHandler = function (item) { //TODO: Implement.
                return false;
            };

            self.handleContainerDrop = function (item) { //TODO: Implement.
                if (item.type() === ContainerType.PIPETTE) {
                    if (!item.hasTip()) {
                        self.popupController.message('Dumt', 'Der er ingen spids på pipetten');
                    }else {
                    }
                }
            };
        },
    });

    return SimpleContainerController;
});
