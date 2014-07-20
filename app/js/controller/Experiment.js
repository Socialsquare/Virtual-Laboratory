define([
    'knockout',
    'base',
    'lodash',
    'controller/Popup',
    'controller/Quiz',
    'model/type/Trigger',
    'model/type/Consequence'
], function (ko, Base, _, popupController, quizController, TriggerType, ConsequenceType) {
    var Experiment = Base.extend({
        constructor: function () {
            var self = this;

            self.activeExperiment = ko.observable();
            self.quizController = quizController;
            self.popupController = popupController;

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

            self.triggerMix = function (addition, container) {
                //TODO: test result.location();

                if (self.activeTask().trigger().type === TriggerType.MIX
                    && self.activeTask().trigger().location === container.parentContainer().location()
                    && self.activeTask().trigger().container === container.type()) {
                    var requiredLiquidTypes = _.map(self.activeTask().trigger().liquids, function (liquid) {
                        return liquid.type;
                    });

                    if (container.containsAll(requiredLiquidTypes)) {
                        if (self.activeTask().hasConsequence()) {
                            var promise;
                            switch (self.activeTask().consequence().type()) {
                            case ConsequenceType.QUIZ:
                                promise = self.quizController.startQuiz(self.activeTask().consequence().quiz);
                                break;
                            case ConsequenceType.VIDEO:
                                promise = self.popupController.video(self.activeTask().consequence().video);
                                break;
                            }
                            promise.then(self.finishActiveTask);
                        } else {
                            self.finishActiveTask();
                        }
                    }
                }
            };

            self.finishActiveTask = function () {
                self.activeTask().finished(true);
                popupController.notify('experiment.task_finished.header', 'experiment.task_finished.body');
            };

            self.triggerMouse = function (action, item) {
                //console.log('Mouse triggered: ' + action);
            };

            self.triggerActivation = function (action, item) {
                //console.log('Action triggered: ' + action);
            };
        }
    });

    return new Experiment();
});
