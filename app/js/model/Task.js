define([
    'knockout',
    'base'
], function(ko, Base) {

    var Task = Base.extend({

        constructor: function (values) {
            var self = this;

            self.id = ko.observable(values.id); //TODO: not set
            self.trigger = ko.observable(values.trigger); //TODO: trigger.type() har 3 typer: mus, action og mix.
            self.quiz = ko.observable(values.quiz);
            self.video = ko.observable(values.video);
            self.description = ko.observable(values.description);
            self.finished = ko.observable(false);
        },
    });

    return Task;
});
