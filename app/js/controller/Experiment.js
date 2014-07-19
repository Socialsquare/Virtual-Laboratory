define([
    'knockout',
    'base',
    'lodash',
    'model/type/Event'
], function (ko, Base, _, EventType) {
    var Experiment = Base.extend({
        constructor: function () {
            var self = this;

            self.activeExperiment = ko.observable();

            self.hasExperiment = ko.computed(function () {
                return !!self.activeExperiment();
            });

            self.startExperiment = function (experiment) {
                self.activeExperiment(experiment);
            };

            self.activeTask = ko.computed(function () {
                if (!self.hasExperiment())
                    return null;

                return _.find(self.activeExperiment().tasks(), function (task) {
                    return !task.finished();
                });
            });

            self.triggerMix = function (addition, result) {
                console.log('Mix triggered in ' + result.type());
            };

            self.triggerMouse = function (action) {
                console.log('Mouse triggered: ' + action);
            };

            self.triggerActivation = function (action) {
                console.log('Action triggered: ' + action);
            };
        }
    });

    return new Experiment();
});
