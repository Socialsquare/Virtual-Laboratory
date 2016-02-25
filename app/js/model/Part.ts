import ko = require('knockout');
import _ = require('lodash');

import TaskModel = require('model/Task');
import ApparatusModel = require('model/Apparatus');

class Part {

    public id: KnockoutObservable<string>;
    public title: KnockoutObservable<string>;
    public apparatus: ApparatusModel;
    public finished: KnockoutObservable<boolean>;
    public tasks: KnockoutObservable<TaskModel[]>;
    public question: KnockoutObservable<string>;

    constructor(value: any) {
        this.id = ko.observable(value.id);
        this.title= ko.observable(value.title);
        this.finished = ko.observable(false);
        this.tasks = ko.observable(<TaskModel[]>_.map(value.tasks, (task) => {
            return new TaskModel(task);
        }));
        this.apparatus = ApparatusModel.parse(value.apparatus);
        this.question = ko.observable(value.question);

        ko.rebind(this);
    }
}

export = Part;
