define([
    'knockout',
    'lodash',
    'base',
    'model/Task'
], function(ko, _, Base, TaskModel) {

    var Experiment = Base.extend({

        constructor: function (values) {
            var self = this;

            self.id = ko.observable(values.id);
            self.title = ko.observable(values.title);
            self.story = ko.observable(values.story);
            self.description = ko.observable(values.description);
            self.tasks = ko.observableArray(_.map(values.tasks, function (task) {
                return new TaskModel(task);
            }));
        },
    });

    return Experiment;
});
