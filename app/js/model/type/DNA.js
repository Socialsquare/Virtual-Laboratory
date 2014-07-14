define[
    'base'
], function (Base) {

    var DNAType = Base.extend({

        PROMOTER:               'DNAType.PROMOTER',
        RIBOSOME_BINDING_SITE:  'DNAType.RIBOSOME_BINDING_SITE',
        START_CODON:            'DNAType.START_CODON',
        PROTEINKODENDE_SEKVENS: 'DNAType.PROTEINKODENDE_SEKVENS',
        STOP_CODON:             'DNAType.STOP_CODON',
        TERMINATOR:             'DNAType.TERMINATOR',

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
};
