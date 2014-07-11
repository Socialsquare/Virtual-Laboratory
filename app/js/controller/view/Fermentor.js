define([
    'knockout',
    'jquery',
    'controller/view/Base'
], function (ko, $, BaseViewController) {

    var Fermentor = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('fermentor');

            self.fermentor = self.gameState.fermentor;
        }
    });

    return Fermentor;
});
