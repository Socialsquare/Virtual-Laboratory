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
                    self.popupController.message('washing.detergent_required.header', 'washing.detergent_required.body');
                else
                    self.status.toggle();

                self.experimentController.triggerActivation(self.ActivationType.WASHING);
            };

            self.reset = function () {
                if (!self.result()) return;

                self.result(0);
                self.status(false);
                self.washing.washingTank.clearContents();
            };

            self.handleWashingDrop = function (item) {
                if (self.status()) return false;

                if (item.isEmpty()) {
                    self.popupController.message('washing.empty_tube.header', 'washing.empty_tube.body');
                    return false;
                }

                self.washing.washingTank.addAll(item.liquids());
                self.status(true);

                var options = [ 1.0, 3.0, 10.0, 30.0, 100.0, 300.0, 1000.0 ];

                var cb = function (concentration) {
                    setTimeout(function () {
                        var res = self.washing.action(concentration);

                        self.result(res.result);
                        self.status(false);

                        if (res.feedback) self.popupController.notify('common.result', res.feedback);
                    }, 500);
                };

                self.popupController.select('washing.concentration',
                                            'washing.concentration.choose',
                                            options,
                                            cb);
            };
        }
    });

    return Washing;
});
