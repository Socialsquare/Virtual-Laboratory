define([
    'knockout',
    'lodash',
    'base',
    'model/ReactionCount'
], function (ko, _, Base, ReactionCount) {

    var Liquid = Base.extend({
        constructor: function (type, reactionCount) {
            var self = this;

            self.type = ko.observable(type);
            self.reactionCount = ko.observable(reactionCount);
            self.hasReacted = ko.observable(false);

            self.subtype = ko.observable(); // defaults to no subtype

            self._react = function (container, fn) {
                if (self.reactionCount() === ReactionCount.NEVER ||
                    (self.hasReacted() && self.reactionCount() === ReactionCount.ONCE))
                    return;

                var reacted = false;
                _.forEach(container.liquids(), function (liquid) {
                    if (self == liquid) return;
                    fn(liquid);
                    reacted = true;
                });

                if (reacted) self.hasReacted(true);
            };

            self.react = function (container) {
                self._react(container, function () {});
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
