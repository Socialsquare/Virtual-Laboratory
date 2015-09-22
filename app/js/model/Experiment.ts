import ko = require('knockout');
import _ = require('lodash');

import TaskModel = require('model/Task');
import ApparatusModel = require('model/Apparatus');

class Experiment {

    public id: KnockoutObservable<string>;
    public title: KnockoutObservable<string>;
    public story: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public parts: KnockoutObservableArray<TaskModel[]>;
    public hasParts: KnockoutComputed<boolean>;
    public tasks: KnockoutComputedArray<TaskModel>;
    public apparatus: ApparatusModel;

    constructor(values) {
        this.id = ko.observable(values.id);
        this.title = ko.observable(values.title);
        this.story = ko.observable(values.story);
        this.description = ko.observable(values.description);
        this.apparatus = ApparatusModel.parse(values.apparatus);
        this.parts = ko.observableArray(_.map(values.parts, (part) => {
            part.tasks = _.map(part.tasks, (task) => {
                return new TaskModel(task);
            });
            return part;
        }));
        this.tasks = ko.pureComputed(() => {
            return _.flatten(_.map(this.parts(), (part) => {
                return part.tasks;
            }));
        });
    }
}

export = Experiment;
