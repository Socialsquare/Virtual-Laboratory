define([
    'knockout',
    'lodash',
    'controller/view/Base',
    'controller/CompositeContainer',
    'model/type/SpecialItem'
], function (ko, _, BaseViewController, CompositeContainerController, SpecialItemType) {

    var Worktable2 = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('worktable2');

            self.worktable2 = self.gameState.worktable2;

            self.tableSpacePetriController = new CompositeContainerController(self.worktable2.tableSpacePetri);
            self.tableSpaceMicroController = new CompositeContainerController(self.worktable2.tableSpaceMicro);
            self.tubeRackController = new CompositeContainerController(self.worktable2.tubeRack);
            self.odController = new CompositeContainerController(self.worktable2.odMachine);

            self.handleBlenderDrop = function (item) {
                self.worktable2.blender.status(true);
                _.delay(function () {
                    self.worktable2.blender.status(false);
                    console.log('TODO: add homogenized spleen to inventory');
                }, 1500);

                if(item.type() === SpecialItemType.SPLEEN) {
                    var antibodies = item.antibodiesFor();
                    var homogenizedSpleen = self.liquidFactory.homoSpleen(antibodies);

                    self.gameState.inventory.add(self.containerFactory.tube().add(homogenizedSpleen));
                }
            };
        }
    });

    return Worktable2;
});