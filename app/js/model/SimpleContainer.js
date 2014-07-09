define([
    'knockout',
    'base',
	'lodash',
	'model/ContainerContent',
    'model/LiquidType'
], function(ko, Base, _, ContainerContent, LiquidType) {

    var SimpleContainer = Base.extend({
        constructor: function (type, maxConcentration) {
            var self = this;

            self.type = ko.observable(type);
            self.maxConcentration = ko.observable(maxConcentration);
            self.liquids = ko.observableArray([]);

            self._add = function (liquids) {
                ko.utils.arrayPushAll(self.liquids, liquids);
            };

            self.add = function (liquids) {
                self.add(liquids);
            };

            self.containsAll = function (liquidTypes) {
                // TODO: LiquidType.WHATEVER_TYPE

                throw 'NotYetImplementedException';
            };

            self.getTotalConcentration = function() {
                var concSum = 0;

                _.forEach(self.liquids(), function(liquid){
                    if(liquid.type === LiquidType.MICROORGANISM)
                    {
                        concSum += liquid.concentration();
                    }
                });

                return concSum;
            };

            self.growContents = function(stepSize) {
                // stepSize is in hours!

                
                // TODO
                // TODO 1st step is a special case
                // TODO the rest of the steps follow another procedure
            };

            self.growthStep = function() {
                // TODO
            };
        }
    });

    return SimpleContainer;
});
