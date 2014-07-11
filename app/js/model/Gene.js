define([
	'knockout',
    'model/Liquid',
    'model/LiquidType',
    'model/ReactionCount',
], function(ko, LiquidModel, LiquidType, ReactionCount) {

    var Gene = LiquidModel.extend({
        constructor: function (elements) {
            var self = this;
            // TODO: patty: correct reaction count?
            self.base(LiquidType.GENE, ReactionCount.ALWAYS);
            self.dnaElements = ko.observableArray(elements || []);
        }
    });

	return Gene;
});
