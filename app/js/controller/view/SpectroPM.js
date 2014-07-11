define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'controller/Notifier'
], function (ko, $, BaseViewController, Notifier) {

    var SpectroPM = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('spectropm');

            self.spectroPM = self.gameState.spectroPM;
        }
    });

    return SpectroPM;
});
