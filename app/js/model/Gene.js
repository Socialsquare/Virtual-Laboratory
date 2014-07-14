define([
	'knockout',
    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount',
], function(ko, LiquidModel, LiquidType, ReactionCount) {

    var Gene = LiquidModel.extend({
        constructor: function (elements) {
            var self = this;
            // TODO: patty: correct reaction count?
            self.base(LiquidType.GENE, ReactionCount.NEVER);
            self.dnaElements = ko.observableArray(elements || []);
        }
    });

	return Gene;
});
