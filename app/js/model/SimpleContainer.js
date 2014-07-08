define([
    'knockout',
    'base',
	'lodash',
	'model/ContainerContent'
], function(ko, Base, _, ContainerContent) {

    var SimpleContainer = Base.extend({
        constructor: function (type, maxConcentration) {
            var self = this;

            self.type = ko.observable(type);
            self.maxConcentration = ko.observable(maxConcentration);
            self.liquids = ko.observableArray([]);

            self._add = function (liquids) {
                ko.utils.arrayPushAll(this.liquids, liquids);
            };

            self.add = function (liquids) {
                self.add(liquids);
            };

            self.containsAll = function (liquids) {
                // TODO:
                throw 'NotYetImplementedException';
            };
        }
    });

    return SimpleContainer;
});
