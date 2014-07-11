define([
    'base'
], function (Base) {

    var DNAType = Base.extend({

        PROMOTER: "DNA_PROMOTER",
        RIBOSOME_BINDING_SITE: "DNA_RIBOSOME_BINDING_SITE",
        START_CODON: "DNA_START_CODON",
        PROTEINKODENDE_SEKVENS: "DNA_PROTEINKODENDE_SEKVENS",
        STOP_CODON: "DNA_STOP_CODON",
        TERMINATOR: "DNA_TERMINATOR",

        fromInt: function (val) {
            var self = this;

            var lookup = [
                self.PROMOTER,
                self.RIBOSOME_BINDING_SITE,
                self.START_CODON,
                self.PROTEINKODENDE_SEKVENS,
                self.STOP_CODON,
                self.TERMINATOR
            ];

            return lookup[val];
        }
    });

    return new DNAType();
});
