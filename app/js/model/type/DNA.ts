class DNAType {

    public PROMOTER =               'DNAType.PROMOTER';
    public RIBOSOME_BINDING_SITE =  'DNAType.RIBOSOME_BINDING_SITE';
    public START_CODON =            'DNAType.START_CODON';
    public PROTEINKODENDE_SEKVENS = 'DNAType.PROTEINKODENDE_SEKVENS';
    public STOP_CODON =             'DNAType.STOP_CODON';
    public TERMINATOR =             'DNAType.TERMINATOR';

    public fromInt = (val) => {
        var lookup = [
            this.PROMOTER,
            this.RIBOSOME_BINDING_SITE,
            this.START_CODON,
            this.PROTEINKODENDE_SEKVENS,
            this.STOP_CODON,
            this.TERMINATOR
        ];

        return lookup[val];
    }
}

export = new DNAType();
