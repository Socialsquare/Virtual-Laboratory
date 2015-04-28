define([
    'knockout',
    'base',
    'lodash',

    'controller/Popup',
    'controller/Quiz',

    'model/type/Liquid',
    'model/type/Activation',
    'model/type/Trigger',
    'model/type/Consequence'
], function (ko, Base, _, popupController, quizController, LiquidType, ActivationType, TriggerType, ConsequenceType) {
    var Experiment = Base.extend({
        constructor: function () {
            var self = this;

            self.activeExperiment = ko.observable();
            self.quizController = quizController;
            self.popupController = popupController;
            self.scrollAmount = 0; //TODO: implement.

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

            self.matchLiquids = function (trigger, container) {
                if (_.isUndefined(trigger.liquids)) return true;

                if (trigger.strict) {
                    var containerValid = _.all(container.liquids(), function (containerLiquid) {
                        return _.any(trigger.liquids, function (triggerLiquid) {
                            if (containerLiquid.type() !== triggerLiquid.type) return false;
                            if (!containerLiquid.subtype()) return true;

                            return containerLiquid.subtype() === triggerLiquid.subtype;
                        });
                    });

                    if (!containerValid) return false;
                }

                return _.all(trigger.liquids, function (liquid) {
                    if (!container.contains(liquid.type)) return false;
                    if (!liquid.subtype) return true;

                    return _.any(container.liquids(), function (_liquid) {
                        return _liquid.subtype() === liquid.subtype;
                    });
                });
            };

            self.triggerMix = function (addition, container) {
                if (!self.hasExperiment()) return;
                if (!self.activeTask()) return; // This happens when all steps in an exercise are done
                var trigger = self.activeTask().trigger();

                if (trigger.type !== TriggerType.MIX) return;
                if (!self.match(trigger.location, container.location())) return;
                if (!self.match(trigger.container, container.type())) return;
                if (!self.match(trigger.containerSubtype, container.subtype())) return;

                if (!self.matchLiquids(trigger, container)) return;

                self.finishActiveTask();
            };

            self.triggerMouse = function (mouse, item) {
                if (!self.hasExperiment()) return;
                if (!self.activeTask()) return; // This happens when all steps in an exercise are done

                var trigger = self.activeTask().trigger();

                if (trigger.type !== TriggerType.MOUSE) return;
                if (!self.match(trigger.alive, mouse.alive())) return;
                if (!self.match(trigger.mouseType, mouse.mouseType())) return;
                if (!self.match(trigger.mouseBloodType, mouse.mouseBloodType())) return;
                if (!self.match(trigger.item, item.type())) return;
                if (!self.matchLiquids(trigger, item)) return;

                self.finishActiveTask();
            };

            self.triggerAcquisition = function (item) {
                if (!self.hasExperiment()) return;
                if (!self.activeTask()) return; // This happens when all steps in an exercise are done

                var trigger = self.activeTask().trigger();

                if (trigger.type !== TriggerType.ACQUIRE) return;
                if (!self.match(trigger.item, item.type())) return;
                if (!self.matchLiquids(trigger, item)) return;

                self.finishActiveTask();
            };

            self.triggerActivation = function (activation, item, extraProperties) {
                if (!self.hasExperiment()) return;
                if (!self.activeTask()) return; // This happens when all steps in an exercise are done

                var trigger = self.activeTask().trigger();
                extraProperties = extraProperties ? extraProperties : {};

                if (trigger.type !== TriggerType.ACTIVATION) return;
                if (trigger.activation !== activation) return;

                if (trigger.activation === ActivationType.COMPUTER_ORDER_MOUSE) {
                    if (!self.match(trigger.mouse.type, item.mouseType())) return;
                }

                if (trigger.activation === ActivationType.OD) {
                    if (!self.matchLiquids(trigger, item)) return;
                }

                if (trigger.activation === ActivationType.SPECTROPM) {
                    if (!self.matchLiquids(trigger, item.microSlot.get(0))) return;

                    var activationSubtype = trigger.activationSubtype;
                    if (!!activationSubtype) {
                        switch(activationSubtype.liquidType) {
                            case LiquidType.DESIGNED_DRUG:

                                var theDrug = _.find(item.microSlot.get(0).liquids(), function(liquid) {
                                    return liquid.type() === LiquidType.DESIGNED_DRUG;
                                });

                                if (!theDrug) return;

                                var affinityScore = theDrug.getAffinityScore() - 8; //8 is a magic number from view/SpectroPM.js
                                if ('maxIc50' in activationSubtype && !(affinityScore < activationSubtype.maxIc50 ))
                                    return;

                                break;

                            default:
                                throw 'Activation-trigger not implemented for the spectrophotometer and the liquidType "'
                                    + activationSubtype.liquidType + '"';
                        }
                    }
                }

                if (trigger.activation === ActivationType.DNA) {
                    if (!self.matchLiquids(trigger, item)) return;
                }

                if (trigger.activation === ActivationType.ELECTROPORATOR) {
                    if (!self.matchLiquids(trigger, item)) return;
                }

                if (trigger.activation === ActivationType.FERMENTOR) {
                    if (!self.matchLiquids(trigger, item.fermentorTank)) return;
                }

                if (trigger.activation === ActivationType.HEATER) {
                    var valid = _(item.containers())
                            .compact()
                            .any(self.matchLiquids.bind(null, trigger));
                    if (!valid) return;
                }

                if (trigger.activation === ActivationType.WASHING) {
                    if (!self.match(trigger.concentration, extraProperties.concentration)) return;
                    if (!self.matchLiquids(trigger, item.washingTank)) return;
                }

                if (trigger.activation === ActivationType.INCUBATOR) {
                    var containers = _(item.tableSpacePetri.containers())
                            .union(item.tubeRack.containers())
                            .compact()
                            .value();

                    var valid = _.all(trigger.containers, function (triggerContainer) {
                        return _.any(containers, function (incubatorContainer) {
                            return self.match(triggerContainer.type, incubatorContainer.type())
                                && self.match(triggerContainer.containerSubtype, incubatorContainer.subtype())
                                && self.matchLiquids({ strict: trigger.strict, liquids: triggerContainer.liquids }, incubatorContainer);
                        });
                    });

                    if (!valid) return;
                }

                if (trigger.activation === ActivationType.COMPUTER_ORDER_DRUG) {
                    // currently don't validate anything about the designed drug
                }

                if (trigger.activation === ActivationType.COMPUTER_ORDER_SEQUENCE) {
                    // currently don't validate anything about the designed drug
                }

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
                    self.popupController.video(conseq.video, true).then(self.markTaskFinished);
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
