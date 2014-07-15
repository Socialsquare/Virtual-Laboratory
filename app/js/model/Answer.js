define([
    'knockout',
    'base'
], function (ko, Base) {

    var Answer = Base.extend({

        constructor: function (values) {
            var self = this;

            self.id = ko.observable(values.id);
            self.answer = ko.observable(values.answer);
            self.message = ko.observable(values.message);
            self.tried = ko.observable(false);
        }
    });

    return Answer;
});
