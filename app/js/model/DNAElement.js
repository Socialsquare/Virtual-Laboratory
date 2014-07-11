// TODO: delete if there's no use for this

define([
    'knockout',
    'model/Liquid',
    'model/LiquidType',
    'model/ReactionCount',
    'model/DNAType'
], function(ko, LiquidModel, LiquidType, ReactionCount, DNAType) {

    // TODO: this should not be a liquid
	var DNAElement = LiquidModel.extend({
        constructor: function (values) {
            var self = this;
            self.base(LiquidType.DNA, ReactionCount.ALWAYS);

			self.DNAType = ko.observable(DNAType.fromInt(values.type));

			self.name = ko.observable(values.name);
			self.color = ko.observable(values.color);
			self.sequence = ko.observable(values.sequence);
			self.description = ko.observable(values.description);
			self.link = ko.observable(values.link);
			self.comment = ko.observable(values.comment);
        },

		parse: function(response) {
			response.type = parseInt(response.type, 10);
			return response;
		},

		equals: function(other) {
			return this.attributes.type === other.attributes.type
                && this.attributes.sequence === other.attributes.sequence;
		}
	});

	return DNAElement;
});
