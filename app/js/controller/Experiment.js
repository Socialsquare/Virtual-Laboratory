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

            self.checkTrigger = function() {
                //TODO: attempt to unify/resolve... /compare with activeTask.
            };

            self.triggerMix = function (addition, result) {
                //TODO: test result.location();
                console.log('Mix triggered in ' + result.type());
            };

            self.triggerMouse = function (action, item) {
                console.log('Mouse triggered: ' + action);
            };

            self.triggerActivation = function (action, item) {
                console.log('Action triggered: ' + action);
            };
        }
    });

    return new Experiment();
});
