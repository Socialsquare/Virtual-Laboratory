define([
    'knockout',
    'jquery',
    'controller/view/Base'
], function (ko, $, BaseViewController) {

    var SpectroPM = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('spectropm');

            self.spectroPM = self.gameState.spectroPM;
        }
    });

    return SpectroPM;
});
