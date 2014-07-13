define([
    'knockout',
    'lodash',
    'base'
], function(ko, _, Base) {

    var Exercise = Base.extend({

        constructor: function (values) {
            var self = this;

            self.id = ko.observable(values.id);
            self.title = ko.observable(values.title);
            self.description = ko.observable(values.description);
            self.tasks = ko.observableArray(_.map(values.tasks, function (task) {
                return new Task(task);
            }));
        },
    });

    return Exercise;
});
