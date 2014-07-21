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


//TODO: i18n localization if necessary
                var options = [
                    {key: '1 mg/L', concentration: 1.0},
                    {key: '3 mg/L', concentration: 3.0},
                    {key: '10 mg/L', concentration: 10.0},
                    {key: '30 mg/L', concentration: 30.0},
                    {key: '100 mg/L', concentration: 100.0},
                    {key: '300 mg/L', concentration: 300.0},
                    {key: '1000 mg/L', concentration: 1000.0}
                ];

                self.popupController.select('washing.concentration', 'washing.concentration.choose', options)
                    .then(function (selectedObject) {
                        var res = self.washing.action(selectedObject.concentration);

                        self.result(res.result);
                        self.status(false);

                        if (res.feedback) self.popupController.notify('common.result', res.feedback);

                        self.experimentController.triggerActivation(self.ActivationType.WASHING, self.washing,
                                                                    { concentration: selectedObject.concentration });
                    });
            };
        }
    });

    return Washing;
});
