define([
    'knockout',
    'base'
], function (ko, Base) {

    var Video = Base.extend({
        constructor: function (name, filePath) {
            var self = this;

            self.name = ko.observable(name);
            self.filePath = ko.observable(filePath);
        }
    });

    return Video;
});
