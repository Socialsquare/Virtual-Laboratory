define([
    'knockout',
    'base'
], function (ko, Base) {

    var Video = Base.extend({
        constructor: function (name, filePath, timeout) {
            var self = this;

            self.name = ko.observable(name);
            self.filePath = ko.observable(filePath);
            self.timeout = ko.observable(timeout);
        }
    });

    return Video;
});
