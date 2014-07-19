define([
    'knockout',
    'base'
], function (ko, Base) {

    var Liquid = Base.extend({
        constructor: function (type, reactionCount) {
            var self = this;

            self.type = ko.observable(type);
            self.reactionCount = ko.observable(reactionCount);
            self.hasReacted = ko.observable(false);
            self.react = function (container) {
                // TODO: implement
            };

            self._hashCode = function() {
                return self.type() + ":" + self.reactionCount() + ":" + self.hasReacted();
            };

            self.hashCode = function() {
                return self._hashCode();
            };

            self.clone = function () {
                var clone = new Liquid(self.type(), self.reactionCount());

                clone.hasReacted(self.hasReacted());

                return clone;
            };
        }
    });

    return Liquid;
});
