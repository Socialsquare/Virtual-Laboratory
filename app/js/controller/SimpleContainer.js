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


            /*self.dropHandler = function (item) { //TODO: Implement.

                return false;
            };*/

            // TODO: this is an almost exact copy of the composite container drop handler
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
                        break;
                    case ContainerType.FERMENTOR_TANK:
                        //TODO: test
                        if (item.type() === ContainerType.SYRINGE) {
                            if(item.isEmpty()) {// 1) Check of syringe er tom? (gør intet)
                                debugger;
                                return false;
                            }else {
                                if(self.simpleContainer.isEmpty()) {// 2) Check om syringe har contents og ferm_tank er tom (tøm kanyle)
                                    item.emptySyringeInto(self.simpleContainer);
                                    self.popupController.notify('syringe.emptied.header', 'syringe.emptied.body', 2000);
                                    return true;
                                }else {// 3) Check om begge har contents og prompt brugern (tøm fermentor og kanylen efter)


                                    console.log('bugs when confirming - TODO: ');

                                    var answer = self.popupController.confirm("fermentor.empty_tank.header", "fermentor.empty_tank.body", function (answer) {
                                        if (answer) {
                                            self.simpleContainer.clearContents();
                                            item.emptySyringeInto(self.simpleContainer);
                                            self.popupController.notify('syringe.emptied.header', 'syringe.emptied.header', 2000);
                                        }

                                        return answer;
                                    });
                                    return answer;
                                }
                            }
                        }
                        break;
                    default:
                        throw 'Happy implementation! :D';
                        break;
                }
            };
        },
    });

    return SimpleContainerController;
});
