import ko = require('knockout');
import _ = require('lodash');

import TaskModel = require('model/Task');
import ApparatusModel = require('model/Apparatus');

class Experiment {

    public id: KnockoutObservable<string>;
    public title: KnockoutObservable<string>;
    public story: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public tasks: KnockoutObservableArray<TaskModel>;
    public apparatus: ApparatusModel;

    constructor(values) {
        this.id = ko.observable(values.id);
        this.title = ko.observable(values.title);
        this.story = ko.observable(values.story);
        this.description = ko.observable(values.description);
        this.apparatus = ApparatusModel.parse(values.apparatus);
        this.tasks = ko.observableArray(_.map(values.tasks, (task) => {
            return new TaskModel(task);
        }));
    }
}

export = Experiment;
