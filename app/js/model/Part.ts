import ko = require('knockout');
import _ = require('lodash');

import TaskModel = require('model/Task');
import ApparatusModel = require('model/Apparatus');

class Part {

    public id: KnockoutObservable<string>;
    public apparatus: ApparatusModel;
    public finished: KnockoutObservable<boolean>;
    public tasks: KnockoutObservable<TaskModel[]>;

    constructor(value: any) {
        this.id = ko.observable(value.id);
        this.finished = ko.observable(false);
        this.tasks = ko.observable(<TaskModel[]>_.map(value.tasks, (task) => {
            return new TaskModel(task);
        }));
        this.apparatus = ApparatusModel.parse(value.apparatus);

        ko.rebind(this);
    }
}

export = Part;
