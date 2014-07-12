define([
    'knockout',
    'lodash',
    'base'
], function (ko, _, Base) {

    var CompositeContainer = Base.extend({
        constructor: function (capacity, acceptedType, type) {
            var self = this;

            self.type = ko.observable(type);
            self.containers = ko.observableArray(new Array(capacity));
            self.acceptedType = ko.observable(acceptedType);

            self._addAt = function (position, container) {
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

            self.addAt = function(position, container) {
                self._addAt(position, container);
            };

            self.anyContainsAll = function (liquidTypes) {
                // TODO: for each container
                throw 'NotYetImplementedException';
            };

            self.get = function (position) {
                return self.containers()[position];
            };

            self.hasContainerAt = function (position) {
                return !!self.get(position);
            };

            self.remove = function (position) {
                self.containers.setAt(position, null);
            };

            self.remove2 = function (item) {
                var idx = self.containers().indexOf(item);
                self.remove(idx);
            };

            self.growContentsOnce = function(deltaTime, growerType, ph, temperature) {
                // deltaTime is in "hours"
                _.forEach(self.containers(), function(container){

                    if(!container) {return;}

                    container.growContentsOnce(deltaTime, growerType, ph, temperature);
                });
            };
        },
    });

    return CompositeContainer;
});
