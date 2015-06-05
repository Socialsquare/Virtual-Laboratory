import ko = require('knockout');
import $ = require('jquery');

import ExperimentModel = require('model/Experiment');
import TaskModel = require('model/Task');
import PopupModel = require('model/Popup');

class GuideModel extends PopupModel {

    public experiment: ExperimentModel;
    public activeTask: KnockoutComputed<TaskModel>;

    public scrollAmount: number;

    constructor(experiment: ExperimentModel) {
        super('popup-guide');

        this.experiment = experiment;

        // This is C/P from experiment controller... :(
        // Work around to avoid circular deps
        this.activeTask = ko.pureComputed(() => {
            if (!this.experiment)
                return null;

            return _.find(this.experiment.tasks(), (task) => {
                return !task.finished();
            });
        });

        ko.rebind(this);
    }

    isActiveTask(task: TaskModel) {
        return task === this.activeTask();
    }

    postRender() {
        super.postRender();

        $('#popup-container .inner').scrollTop(this.scrollAmount);
    }

    hide() {
        this.scrollAmount = $('#popup-container .inner').scrollTop();

        super.hide();
    }
}

export = GuideModel;
