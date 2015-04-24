define([
    'knockout',
    'base'
], function (ko, Base) {

    var HelpEntry = Base.extend({

        constructor: function (values) {
            var self = this;

            self.title = values.title;
            self.body = values.body;
            self.image = values.image;
            self.route = values.route;
        }
    });

    return HelpEntry;
});
