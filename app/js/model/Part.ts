import ko = require('knockout');

import TaskModel = require('model/Task');

class Part {

    public tasks: KnockoutObservable<TaskModel[]>;

    constructor(value: any) {
        this.tasks = ko.observable(<TaskModel[]>_.map(value.tasks, (task) => {
            return new TaskModel(task);
        }));

        ko.rebind(this);
    }
}

export = Part;
