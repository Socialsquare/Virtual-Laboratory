define([
    'knockout',
    'base'
], function (ko, Base) {

    var CompositeContainer = Base.extend({
        constructor: function (capacity, acceptedType, type) {
            var self = this;

            self.type = ko.observable(type);
            self.containers = ko.observableArray(new Array(capacity));
            self.acceptedType = ko.observable(acceptedType);

            self.addAt = function (position, container) {
                if (container.type() !== self.acceptedType()) {
                    // TODO: notify error
                    return false;
                }

                if (!!self.get(position)) {
                    return false;
                }

                self.containers.setAt(position, container);

                return true;
            };

            self.anyContainsAll = function (liquids) {
                // TODO: for each container
                throw 'NotYetImplementedException';
            };

            self.get = function (position) {
                return self.containers()[position];
            };

            self.remove = function (position) {
                self.containers.setAt(position, null);
            };
        },
    });

    return CompositeContainer;
});
