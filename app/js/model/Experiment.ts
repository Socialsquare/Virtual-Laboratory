import ko = require('knockout');
import _ = require('lodash');

import PartModel = require('model/Part');
import TaskModel = require('model/Task');
import ApparatusModel = require('model/Apparatus');

class Experiment {

    public id: KnockoutObservable<string>;
    public title: KnockoutObservable<string>;
    public story: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public apparatus: ApparatusModel;
    public parts: KnockoutObservableArray<PartModel>;
    public tasks: KnockoutComputed<TaskModel[]>;

    constructor(values) {
        this.id = ko.observable(values.id);
        this.title = ko.observable(values.title);
        this.story = ko.observable(values.story);
        this.description = ko.observable(values.description);
        this.apparatus = ApparatusModel.parse(values.apparatus);
        this.parts = ko.observableArray(<PartModel[]>_.map(values.parts, (part) => {
            return new PartModel(part);
        }));
        this.tasks = ko.pureComputed(() => {
            return <TaskModel[]>_.flatten(_.map(this.parts(), (part) => {
                return part.tasks();
            }));
        });
    }
}

export = Experiment;
