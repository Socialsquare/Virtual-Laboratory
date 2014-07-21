define([
    'knockout',
    'base',
    'lodash',

    'controller/Popup',
    'controller/Quiz',

    'model/type/Liquid',
    'model/type/Trigger',
    'model/type/Consequence'
], function (ko, Base, _, popupController, quizController, LiquidType, TriggerType, ConsequenceType) {
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

            // return whether a property is defined and matches another
            self.match = function (property, expected) {
                return _.isUndefined(property) || property === expected;
            };

            self.matchLiquids = function (liquids, container) {
                if (_.isUndefined(liquids)) return true;

                return _.all(liquids, function (liquid) {
                    if (!container.contains(liquid.type)) return false;
                    if (!liquid.subtype) return true;

                    return _.any(container.liquids(), function (_liquid) {
                        return _liquid.subtype() === liquid.subtype;
                    });
                });
            };

            self.triggerMix = function (addition, container) {
                if (!self.hasExperiment()) return;
                var trigger = self.activeTask().trigger();

                if (trigger.type !== TriggerType.MIX) return;
                if (!self.match(trigger.location, container.location())) return;
                if (!self.match(trigger.container, container.type())) return;
                if (!self.matchLiquids(trigger.liquids, container)) return;

                self.finishActiveTask();
            };

            self.triggerMouse = function (mouse, item) {
                if (!self.hasExperiment()) return;
                var trigger = self.activeTask().trigger();

                if (trigger.type !== TriggerType.MOUSE) return;
                if (!self.match(trigger.alive, mouse.alive())) return;
                if (!self.match(trigger.item, item.type())) return;
                if (!self.matchLiquids(trigger.liquids, item)) return;

                self.finishActiveTask();
            };

            self.triggerAcquisition = function (item) {
                if (!self.hasExperiment()) return;
                var trigger = self.activeTask().trigger();

                if (trigger.type !== TriggerType.ACQUIRE) return;
                if (!self.match(trigger.item, item.type())) return;
                if (!self.matchLiquids(trigger.liquids, item)) return;

                self.finishActiveTask();
            };

            self.triggerActivation = function (activation, item) {
                if (!self.hasExperiment()) return;
                var trigger = self.activeTask().trigger();

                if (trigger.type !== TriggerType.ACTIVATION) return;
                if (trigger.activation !== activation) return;

                self.finishActiveTask();
            };

            self.finishActiveTask = function () {
                if (!self.activeTask().hasConsequence()) {
                    self.markTaskFinished();
                    return;
                }

                var conseq = self.activeTask().consequence();

                switch (conseq.type()) {
                case ConsequenceType.QUIZ:
                    self.quizController.startQuiz(conseq.quiz).then(self.markTaskFinished);
                    break;
                case ConsequenceType.VIDEO:
                    self.popupController.video(conseq.video).then(self.markTaskFinished);
                    break;
                }
            };

            self.markTaskFinished = function () {
                self.activeTask().finished(true);

                var allDone = _(self.activeExperiment().tasks()).invoke('finished').all();
                if (allDone) {
                    popupController.message('experiment.completed.header', 'experiment.completed.body');
                } else {
                    popupController.notify('experiment.task_finished.header', 'experiment.task_finished.body');
                }
            };
        }
    });

    return new Experiment();
});
