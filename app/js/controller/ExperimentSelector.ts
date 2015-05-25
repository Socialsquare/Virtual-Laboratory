import ko = require('knockout');

import popupController = require('controller/Popup');
import experimentService = require('service/Experiment');

import BaseViewController = require('controller/view/Base');

import ExperimentModel = require('model/Experiment');

class ExperimentSelector extends BaseViewController {

    public experiments: KnockoutObservableArray<ExperimentModel>;
    public selected: KnockoutObservable<ExperimentModel>;

    constructor() {
        super('experiment-selector')

        this.experiments = ko.observableArray([]);
        this.selected = ko.observable(null);

        experimentService.getExperiments().done((experiments) => {
            this.experiments(experiments);
        });
    }

    public select = (experiment) => {
        this.selected(experiment);
    }

    public goBack = () => {
        this.router.back();
    }

    public start = () => {
        if (this.experimentController.hasExperiment()) {
            popupController.confirm('experiment.change.header', 'experiment.change.body')
                .then(() => {
                    this.gameState.reset();
                    this.experimentController.startExperiment(this.selected());
                    this.router.navigate('overview');
                });

            return;
        }

        this.experimentController.startExperiment(this.selected());

        this.router.navigate('overview');
    }
}

export = ExperimentSelector;
