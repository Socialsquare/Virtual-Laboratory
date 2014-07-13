define([
    'knockout',
    'base'
], function(ko, Base) {

    var Task = Base.extend({

        constructor: function (values) {
            var self = this;

            self.id = ko.observable(values.id);
            self.description = ko.observable(values.description);
        },

    });

    return Task;
});
