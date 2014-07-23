define([
    'knockout',
    'controller/view/Base',
    'controller/Popup',
    'controller/Experiment',
    'service/Experiment'
], function (ko, BaseViewController, popupController, experimentController, experimentService) {

    var ExperimentSelector = BaseViewController.extend({

        constructor: function () {
            var self = this;

            self.experiments = ko.observableArray([]);
            self.selected = ko.observable();

            experimentService.getExperiments().done(function (experiments) {
                self.experiments(experiments);
            });

            self.select = function (experiment) {
                self.selected(experiment);
            };

            self.goBack = function () {
                self.router.back();
            };

            self.start = function () {
                if (self.experimentController.hasExperiment()) {
                    popupController.confirm('experiment.change.header', 'experiment.change.body')
                        .then(function () {
                            self.gameState.reset();
                            self.experimentController.startExperiment(self.selected());
                            self.router.navigate('overview');
                        });

                    return;
                }

                self.experimentController.startExperiment(self.selected());

                self.router.navigate('overview');
            };
        }
    });

    return ExperimentSelector;
});
