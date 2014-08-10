define([
    'knockout',
    'jquery',
    'controller/view/Base'
], function (ko, $, BaseViewController) {

    var SpectroPM = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('spectropm');

            self.plotData = ko.observable({});

            self.plotData({affinityData: [[-9, 100], [-8, 95], [-7, 85], [-6, 50], [-5, 15], [-4, 5], [-3, 0]]});

            self.spectroPM = self.gameState.spectroPM;
        }
    });

    return SpectroPM;
});
