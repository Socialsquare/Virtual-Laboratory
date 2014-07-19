define([
    'knockout',
    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount',
    'model/type/DNA'
], function(ko, LiquidModel, LiquidType, ReactionCount, DNAType) {
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

            self.hashCode = function () {
                return self._hashCode() + ":" + self.name() + ":" + self.DNAType();
            };

            self.clone = function () {
                var clone = new DNAElement({type: 0,name: self.name(),color: self.color(),
                    sequence: self.sequence(),description: self.description(),
                    link: self.link(),comment: self.comment()});

                clone.DNAType(self.DNAType());
                clone.hasReacted(self.hasReacted());

                return clone;
            };


            /*self.clone = function () {
                var clone = new DNAElement();

                clone.hasReacted(self.hasReacted());

                clone.DNAType(self.DNAType());
			    clone.name(self.name());
			    clone.color(self.color());
			    clone.sequence(self.sequence());
			    clone.description(self.description());
			    clone.link(self.link());
			    clone.comment(self.comment());

                return clone;
            };*/
        },
	});

	return DNAElement;
});
