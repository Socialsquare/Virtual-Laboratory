define([
    'knockout',
    'jquery',
    'controller/SimpleContainer',
    'controller/view/Base'
], function (ko, $, SimpleContainerController, BaseViewController) {

    var Fermentor = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('fermentor');

            self.fermentor = self.gameState.fermentor;
            self.fermentorTankController = new SimpleContainerController(self.fermentor.fermentorTank, self.gameState);
        }
    });

    return Fermentor;
});
