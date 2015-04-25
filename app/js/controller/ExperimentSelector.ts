import ko = require('knockout');
import BaseViewController = require('controller/view/Base');
import popupController = require('controller/Popup');
import experimentController = require('controller/Experiment');
import experimentService = require('service/Experiment');

class ExperimentSelector extends BaseViewController {

    constructor() {
        super()

        this.experiments = ko.observableArray([]);
        this.selected = ko.observable();

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
