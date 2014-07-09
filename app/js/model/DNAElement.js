// TODO: delete if there's no use for this

define([
    'base'
], function(Base) {
	var DNAElement = Base.extend({
        constructor: function () {
            self.id = null;
			self.name = '';
			self.color = '';
			self.sequence = '';
			self.description = '';
			self.link = '';
			self.comment = '';
			self.type = 0;
            //0=Promoter, 1=Ribosome Binding Site, 2=Start Codon, 3=Proteinkodende Sekvens, 4=Stop Codon, 5=Terminator
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
