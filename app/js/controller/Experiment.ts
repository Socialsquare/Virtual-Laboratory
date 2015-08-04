import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');
import quizController = require('controller/Quiz');

import HeaterModel = require('model/Heater');
import IceBathModel = require('model/IceBath');
import IncubatorModel = require('model/Incubator');
import ScaffoldModel = require('model/Scaffold');
import SpectroPMModel = require('model/SpectroPM');
import TaskModel = require('model/Task');
import LiquidModel = require('model/Liquid');
import MouseModel = require('model/Mouse');
import TriggerModel = require('model/Trigger');
import ExperimentModel = require('model/Experiment');
import SimpleContainerModel = require('model/SimpleContainer');
import QuizConsequenceModel = require('model/QuizConsequence');
import VideoConsequenceModel = require('model/VideoConsequence');

import LiquidType = require('model/type/Liquid');
import ActivationType = require('model/type/Activation');
import TriggerType = require('model/type/Trigger');
import ConsequenceType = require('model/type/Consequence');

type TriggerExtraProperties = {
    concentration?: number
};

class Experiment {

    public activeExperiment: KnockoutObservable<ExperimentModel>;
    public activeTask: KnockoutComputed<TaskModel>;

    public hasExperiment: KnockoutComputed<boolean>;

    public quizController = quizController;
    public popupController = popupController;

    constructor() {
        this.activeExperiment = ko.observable(null);

        this.hasExperiment = ko.pureComputed(() => {
            return !!this.activeExperiment();
        });

        this.activeTask = ko.pureComputed(() => {
            if (!this.hasExperiment())
                return null;

            return _.find(this.activeExperiment().tasks(), (task) => {
                return !task.finished();
            });
        });

        ko.rebind(this);
    }

    startExperiment(experiment) {
        this.activeExperiment(experiment);
    }

    // return whether a property is defined and matches another
    match(property: any, expected: any) {
        return _.isUndefined(property) || _.isNull(property) || property === expected;
    }

    matchLiquids(trigger: TriggerModel, container: SimpleContainerModel) {
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

    matchLiquidOrder(trigger: TriggerModel, container: SimpleContainerModel) {
        if (_.isUndefined(trigger.liquids)) return true;
        if (trigger.strictlyOrdered) {
            var liquidPairs = _.zip(container.liquids(), trigger.liquids);
            return _.all(liquidPairs, (pair) => {
                return pair[0].type() === pair[1].type;
            });
        }

        return true;
    }

    triggerMix(addition: LiquidModel[], container: SimpleContainerModel) {
        if (!this.hasExperiment()) return;
        if (!this.activeTask()) return; // This happens when all steps in an exercise are done
        var trigger = this.activeTask().trigger();

        if (trigger.type !== TriggerType.MIX) return;
        if (!this.match(trigger.location, container.location())) return;
        if (!this.match(trigger.container, container.type())) return;
        if (!this.match(trigger.containerSubtype, container.subtype())) return;

        if (!this.matchLiquids(trigger, container)) return;
        if (!this.matchLiquidOrder(trigger, container)) return;

        this.finishActiveTask();
    }

    triggerMouse(mouse: MouseModel, item) {
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

    triggerAcquisition(item) {
        if (!this.hasExperiment()) return;
        // This happens when all steps in an exercise are done
        if (!this.activeTask()) return;

        var trigger = this.activeTask().trigger();

        if (trigger.type !== TriggerType.ACQUIRE) return;
        if (!this.match(trigger.item, item.type())) return;
        if (!this.matchLiquids(trigger, item)) return;

        this.finishActiveTask();
    }

    triggerActivation(activation: ActivationType, item, extraProperties: TriggerExtraProperties = {}) {
        if (!this.hasExperiment()) return;
        // This happens when all steps in an exercise are done
        if (!this.activeTask()) return;

        var trigger = this.activeTask().trigger();

        if (trigger.type !== TriggerType.ACTIVATION) return;
        if (trigger.activation !== activation) return;

        if (trigger.activation === ActivationType.COMPUTER_ORDER_MOUSE) {
            if (!this.match(trigger.mouseType, item.mouseType())) return;
        }

        if (trigger.activation === ActivationType.OD) {
            if (!this.matchLiquids(trigger, item)) return;
        }

        if (trigger.activation === ActivationType.SPECTROPM) {
            var spectro = <SpectroPMModel>item;
            if (!this.matchLiquids(trigger, spectro.microSlot.get(0))) return;

            var activationSubtype = trigger.activationSubtype;
            if (!!activationSubtype) {
                switch (activationSubtype.liquidType) {
                case LiquidType.DESIGNED_DRUG:
                    var theDrug = <ScaffoldModel>_.find(spectro.microSlot.get(0).liquids(), (liquid) => {
                        return liquid.type() === LiquidType.DESIGNED_DRUG;
                    });

                    if (!theDrug) return;

                    // 8 is a magic number from view/SpectroPM.js
                    var affinityScore = theDrug.getAffinityScore() - 8;
                    if ('maxIc50' in activationSubtype && !(affinityScore < activationSubtype.maxIc50))
                        return;

                    break;

                default:
                    throw 'Activation-trigger not implemented for the spectrophotometer and the liquidType "'
                        + activationSubtype.liquidType + '"';
                }
            }
        }

        // if (trigger.activation === ActivationType.DNA) {
        //     if (!this.matchLiquids(trigger, item)) return;
        // }

        if (trigger.activation === ActivationType.ELECTROPORATOR) {
            if (!this.matchLiquids(trigger, item)) return;
        }

        if (trigger.activation === ActivationType.FERMENTOR) {
            if (!this.matchLiquids(trigger, item.fermentorTank)) return;
        }

        if (trigger.activation === ActivationType.HEATER) {
            var heater = <HeaterModel>item;
            var compacted = _.compact(heater.containers());
            var validHeater = _.isEmpty(compacted) || _.any(compacted, _.partial(this.matchLiquids, trigger));
            if (!validHeater) return;
        }
        
        if (trigger.activation === ActivationType.ICE_BATH) {
            var iceBath = <IceBathModel>item;
            var compacted = _.compact(iceBath.containers());
            var validIceBath = _.isEmpty(compacted) || _.any(compacted, _.partial(this.matchLiquids, trigger));
            if (!validIceBath) return;
        }

        if (trigger.activation === ActivationType.WASHING) {
            if (!this.match(trigger.concentration, extraProperties.concentration)) return;
            if (!this.matchLiquids(trigger, item.washingTank)) return;
        }

        if (trigger.activation === ActivationType.INCUBATOR) {
            var incubator = <IncubatorModel>item;
            var unioned = _.union(incubator.tableSpacePetri.containers(), incubator.tubeRack.containers());
            var containers = _.compact(unioned);

            var validIncubator = _.all(trigger.containers, (triggerContainer) => {
                return _.any(containers, (incubatorContainer) => {
                    return this.match(triggerContainer.type, incubatorContainer.type())
                        && this.match(triggerContainer.containerSubtype, incubatorContainer.subtype())
                        && this.matchLiquids(new TriggerModel({ strict: trigger.strict, liquids: triggerContainer.liquids }), incubatorContainer);
                });
            });

            if (!validIncubator) return;
        }

        if (trigger.activation === ActivationType.COMPUTER_ORDER_DRUG) {
            // currently don't validate anything about the designed drug
        }

        if (trigger.activation === ActivationType.COMPUTER_ORDER_SEQUENCE) {
            // currently don't validate anything about the designed drug
        }

        this.finishActiveTask();
    }

    finishActiveTask() {
        if (!this.activeTask().hasConsequence()) {
            this.markTaskFinished();
            return;
        }

        var conseq = this.activeTask().consequence();

        switch (conseq.type()) {
        case ConsequenceType.QUIZ:
            this.quizController.startQuiz((<QuizConsequenceModel>conseq).quiz).then(this.markTaskFinished);
            break;
        case ConsequenceType.VIDEO:
            this.popupController.video((<VideoConsequenceModel>conseq).video, true).then(this.markTaskFinished);
            break;
        }
    }

    markTaskFinished() {
        this.activeTask().finished(true);

        var allDone = _.all(_.invoke(this.activeExperiment().tasks(), 'finished'));
        if (allDone) {
            popupController.message('experiment.completed.header', 'experiment.completed.body');
        } else {
            popupController.notify('experiment.task_finished.header', 'experiment.task_finished.body');
        }
    }
}

export = new Experiment();
