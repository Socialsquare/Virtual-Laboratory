import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');
import quizController = require('controller/Quiz');

import ExperimentModel = require('model/Experiment');

import LiquidType = require('model/type/Liquid');
import ActivationType = require('model/type/Activation');
import TriggerType = require('model/type/Trigger');
import TriggerModel = require('model/Trigger');
import ConsequenceType = require('model/type/Consequence');

class Experiment {

    public activeExperiment: KnockoutObservable<ExperimentModel>;
    public quizController: QuizController;
    public popupController: PopupController;
    public scrollAmount: number;

    constructor() {
        this.activeExperiment = ko.observable();
        this.quizController = quizController;
        this.popupController = popupController;
        this.scrollAmount = 0; //TODO: implement.

        this.hasExperiment = ko.computed(() => {
            return !!this.activeExperiment();
        });

        this.activeTask = ko.computed(() => {
            if (!this.hasExperiment())
                return null;

            return _.find(this.activeExperiment().tasks(), (task) => {
                return !task.finished();
            });
        });
    }

    public startExperiment = (experiment) => {
        this.activeExperiment(experiment);
    }

    // return whether a property is defined and matches another
    public match = (property, expected) => {
        return _.isUndefined(property) || _.isNull(property) || property === expected;
    }

    public matchLiquids = (trigger: TriggerModel, container) => {
        if (_.isUndefined(trigger.liquids)) return true;

        if (trigger.strict) {
            var containerValid = _.all(container.liquids(), (containerLiquid) => {
                return _.any(trigger.liquids, (triggerLiquid) => {
                    if (containerLiquid.type() !== triggerLiquid.type) return false;
                    if (!containerLiquid.subtype()) return true;

                    return containerLiquid.subtype() === triggerLiquid.subtype;
                });
            });

            if (!containerValid) return false;
        }

        return _.all(trigger.liquids, (liquid) => {
            if (!container.contains(liquid.type)) return false;
            if (!liquid.subtype) return true;

            return _.any(container.liquids(), (_liquid) => {
                return _liquid.subtype() === liquid.subtype;
            });
        });
    }

    public triggerMix = (addition, container) => {
        if (!this.hasExperiment()) return;
        if (!this.activeTask()) return; // This happens when all steps in an exercise are done
        var trigger = this.activeTask().trigger();

        if (trigger.type !== TriggerType.MIX) return;
        if (!this.match(trigger.location, container.location())) return;
        if (!this.match(trigger.container, container.type())) return;
        if (!this.match(trigger.containerSubtype, container.subtype())) return;

        if (!this.matchLiquids(trigger, container)) return;

        this.finishActiveTask();
    }

    public triggerMouse = (mouse, item) => {
        if (!this.hasExperiment()) return;
        if (!this.activeTask()) return; // This happens when all steps in an exercise are done

        var trigger = this.activeTask().trigger();

        if (trigger.type !== TriggerType.MOUSE) return;
        if (!this.match(trigger.alive, mouse.alive())) return;
        if (!this.match(trigger.mouseType, mouse.mouseType())) return;
        if (!this.match(trigger.mouseBloodType, mouse.mouseBloodType())) return;
        if (!this.match(trigger.item, item.type())) return;
        if (!this.matchLiquids(trigger, item)) return;

        this.finishActiveTask();
    }

    public triggerAcquisition = (item) => {
        if (!this.hasExperiment()) return;
        if (!this.activeTask()) return; // This happens when all steps in an exercise are done

        var trigger = this.activeTask().trigger();

        if (trigger.type !== TriggerType.ACQUIRE) return;
        if (!this.match(trigger.item, item.type())) return;
        if (!this.matchLiquids(trigger, item)) return;

        this.finishActiveTask();
    }

    public triggerActivation = (activation, item, extraProperties) => {
        if (!this.hasExperiment()) return;
        if (!this.activeTask()) return; // This happens when all steps in an exercise are done

        var trigger = this.activeTask().trigger();
        extraProperties = extraProperties ? extraProperties : {};

        if (trigger.type !== TriggerType.ACTIVATION) return;
        if (trigger.activation !== activation) return;

        if (trigger.activation === ActivationType.COMPUTER_ORDER_MOUSE) {
            if (!this.match(trigger.mouse.type, item.mouseType())) return;
        }

        if (trigger.activation === ActivationType.OD) {
            if (!this.matchLiquids(trigger, item)) return;
        }

        if (trigger.activation === ActivationType.SPECTROPM) {
            if (!this.matchLiquids(trigger, item.microSlot.get(0))) return;

            var activationSubtype = trigger.activationSubtype;
            if (!!activationSubtype) {
                switch(activationSubtype.liquidType) {
                case LiquidType.DESIGNED_DRUG:

                    var theDrug = _.find(item.microSlot.get(0).liquids(), (liquid) => {
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
            if (!this.matchLiquids(trigger, item)) return;
        }

        if (trigger.activation === ActivationType.ELECTROPORATOR) {
            if (!this.matchLiquids(trigger, item)) return;
        }

        if (trigger.activation === ActivationType.FERMENTOR) {
            if (!this.matchLiquids(trigger, item.fermentorTank)) return;
        }

        if (trigger.activation === ActivationType.HEATER) {
            var valid = _(item.containers())
                .compact()
                .any(this.matchLiquids.bind(null, trigger));
            if (!valid) return;
        }

        if (trigger.activation === ActivationType.WASHING) {
            if (!this.match(trigger.concentration, extraProperties.concentration)) return;
            if (!this.matchLiquids(trigger, item.washingTank)) return;
        }

        if (trigger.activation === ActivationType.INCUBATOR) {
            var containers = _(item.tableSpacePetri.containers())
                .union(item.tubeRack.containers())
                .compact()
                .value();

            var valid = _.all(trigger.containers, (triggerContainer) => {
                return _.any(containers, (incubatorContainer) => {
                    return this.match(triggerContainer.type, incubatorContainer.type())
                        && this.match(triggerContainer.containerSubtype, incubatorContainer.subtype())
                        && this.matchLiquids({ strict: trigger.strict, liquids: triggerContainer.liquids }, incubatorContainer);
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

        this.finishActiveTask();
    }

    public finishActiveTask = () => {
        if (!this.activeTask().hasConsequence()) {
            this.markTaskFinished();
            return;
        }

        var conseq = this.activeTask().consequence();

        switch (conseq.type()) {
        case ConsequenceType.QUIZ:
            this.quizController.startQuiz(conseq.quiz).then(this.markTaskFinished);
            break;
        case ConsequenceType.VIDEO:
            this.popupController.video(conseq.video, true).then(this.markTaskFinished);
            break;
        }
    }

    public markTaskFinished = () => {
        this.activeTask().finished(true);

        var allDone = _(this.activeExperiment().tasks()).invoke('finished').all();
        if (allDone) {
            popupController.message('experiment.completed.header', 'experiment.completed.body');
        } else {
            popupController.notify('experiment.task_finished.header', 'experiment.task_finished.body');
        }
    }
}

export = new Experiment();
