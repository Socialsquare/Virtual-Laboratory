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

            /*self.dropHandler = function (item) { //TODO: Implement.

                return false;
            };*/

            self.handleContainerDrop = function (item) { //TODO: Implement.

                switch (simpleContainer.type()) {
                    case ContainerType.ELECTROPORATOR:
                        if (item.type() === ContainerType.PIPETTE) {
                            if (!item.hasTip()) {
                                self.popupController.message('Dumt', 'Der er ingen spids på pipetten');

                            } else if(self.simpleContainer.isEmpty()) { //TODO: 1) hvis elektro er tom --> tilføj all the things
                                item.emptyPipetteInto(self.simpleContainer);
                                self.popupController.notify('Info', 'Du har tømt pipetten.', 2000);

                            } else if(!self.simpleContainer.isEmpty() && item.getTip().isEmpty()){ // 2) hvis elektro har contents && pipette er tom --> sug alt

                                if(item.getTip().used()) {
                                    self.popupController.message('Dumt', 'Pipetten skal have en ren spids, ellers forurener du dine prøver.');
                                } else {
                                    self.popupController.notify('Info', 'Du har suget indhold op med pipetten.', 2000);
                                    item.fillPipette(self.simpleContainer);
                                }
                                //TODO: tom elektroporator - eller nej? Det kommer i næste case

                            } else if(!self.simpleContainer.isEmpty() && !item.getTip().isEmpty()){ //TODO:3) hvis elektro har contents && pipette har contents --> spørg: Vil du tømme elektro og tilføje?

                                self.popupController.confirm("Bekræft", "Vil du tømme elektroporatoren og tilføje indholdet fra pipetten?", function (answer) {
                                    if (answer) {
                                        self.simpleContainer.clearContents();
                                        item.emptyPipetteInto(self.simpleContainer);
                                        self.popupController.notify('Info', 'Du har tømt pipetten.', 2000);
                                    }
                                });

                            }
                        }
                        break
                            ;
                    default:
                        throw 'Happy implementation! :D';
                        break;
                }
            };
        },
    });

    return SimpleContainerController;
});
