define([
    'knockout',
    'controller/view/Base',
    'controller/CompositeContainer'

], function (ko, BaseViewController, CompositeContainerController) {

    var Washing = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('washing');

            self.washing = self.gameState.washing;
            self.status = ko.observable(false);
            self.result = ko.observable(0);

            self.tubeRackController = new CompositeContainerController(self.washing.tubeRack);

            self.activate = function () {
                if (!self.washing.agent())
                    self.popupController.message('Hov hov du', 'Du mangler vaskemiddel');
                else
                    self.status.toggle();
            };

            self.reset = function () {
                if (!self.result()) return;

                self.result(0);
                self.status(false);
                self.washing.agents([]);
            };

            self.handleWashingDrop = function (item) {
                if (self.status()) return false;

                if (item.isEmpty()) {
                    self.popupController.message('Hov hov du', 'Ditt reagensglas er tomt...');
                    return false;
                }

                self.washing.agents(item.liquids());
                self.status(true);

                var options = [0.0, 0.5, 1.0];

                var cb = function (concentration) {
                    setTimeout(function () {
                        var res = self.washing.action(concentration);

                        self.result(res.result);
                        self.status(false);

                        if (res.feedback) self.popupController.notify('Resultat', res.feedback);
                    }, 500);
                }

                self.popupController.select('Konsentration',
                                            'Bestem konsentrationen av middelet:',
                                            options,
                                            cb);
            };
        }
    });

    return Washing;
});
