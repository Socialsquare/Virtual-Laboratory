define([
    'knockout',
    'lodash',
    'base',

    'controller/Popup',

    'model/type/Container',
    'model/Syringe',

    'utils/ImageHelper',
    'utils/DragHelper'
], function (ko, _, Base, popupController, ContainerType, SyringeModel, ImageHelper, DragHelper) {

    var SimpleContainerController = Base.extend({

        constructor: function (simpleContainer, gameState) {
            var self = this;

            self.DragHelper = DragHelper;
            self.popupController = popupController;
            self.simpleContainer = simpleContainer;
            self.gameState = gameState;

            // defaults
            self.dropGuard = _.constant(true);
            self.showPlaceholder = ko.observable(false);

            self.handleContainerDrop = function (item) { //TODO: Implement.

                switch (simpleContainer.type()) {
                    case ContainerType.ELECTROPORATOR:
                        if (item.type() === ContainerType.PIPETTE) {
                            if (!item.hasTip()) {
                                self.popupController.message('pipette.missing_tip.header', 'pipette.missing_tip.body');
                            } else if (self.simpleContainer.isEmpty()) { // 1) hvis elektro er tom --> tilføj all the things
                                item.emptyPipetteInto(self.simpleContainer);
                                self.popupController.notify('pipette.emptied.header', 'pipette.emptied.body', 2000);

                            } else if (!self.simpleContainer.isEmpty() && item.getTip().isEmpty()){ // 2) hvis elektro har contents && pipette er tom --> sug alt

                                if (item.getTip().used()) {
                                    self.popupController.message('pipette.dirty_tip.header', 'pipette.dirty_tip.body');

                                } else {
                                    self.popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                                    item.fillPipette(self.simpleContainer);
                                }

                            } else if (!self.simpleContainer.isEmpty() && !item.getTip().isEmpty()) { // 3) hvis elektro har contents && pipette har contents --> spørg: Vil du tømme elektro og tilføje?

                                self.popupController.confirm('worktable1.electroporator_refill.header','worktable1.electroporator_refill.body')
                                    .then(function () {
                                        self.simpleContainer.clearContents();
                                        item.emptyPipetteInto(self.simpleContainer);
                                        self.popupController.notify('pipette.filled.header', 'pipette.filled.body', 2000);
                                    });

                            }
                        }
                        break;
                    case ContainerType.FERMENTOR_TANK:
                        //TODO: test
                        if (item.type() === ContainerType.SYRINGE) {

                            if(item.isEmpty()) {// 1) Check of syringe er tom? (gør intet)
                                return false;
                            } else {
                                if (self.simpleContainer.isEmpty()) {// 2) Check om syringe har contents og ferm_tank er tom (tøm kanyle)
                                    item.emptySyringeInto(self.simpleContainer);
                                    self.popupController.notify('syringe.emptied.header', 'syringe.emptied.body', 2000);
                                    return true;
                                } else {// 3) Check om begge har contents og prompt brugern (tøm fermentor og kanylen efter)

                                    self.popupController.confirm("fermentor.empty_tank.header", "fermentor.empty_tank.body")
                                        .then(function () {
                                            //When accepted

                                            self.simpleContainer.clearContents();
                                            self.simpleContainer.hasRun(false); //This is used when restarting the fermentor
                                            item.emptySyringeInto(self.simpleContainer);
                                            self.gameState.fermentor.resetContents();
                                            self.popupController.notify('syringe.emptied.header', 'syringe.emptied.body', 2000);
                                        }).fail(function() {
                                            //When rejected

                                            var clonedLiqs = item.cloneLiquids();
                                            var clonedSyringe = new SyringeModel();
                                            clonedSyringe.liquids(clonedLiqs);
                                            self.gameState.inventory.add(clonedSyringe);
                                        });
                                }
                            }
                        }
                        break;
                    default:
                        throw 'Needs implementation';
                        break;
                }
            };
        },
    });

    return SimpleContainerController;
});
