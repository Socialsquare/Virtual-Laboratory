import ev = require('enumvalue');

enum DNAType {
    PROMOTER               = ev.next(),               //'DNAType.PROMOTER';
    RIBOSOME_BINDING_SITE  = ev.next(),  //'DNAType.RIBOSOME_BINDING_SITE';
    START_CODON            = ev.next(),            //'DNAType.START_CODON';
    PROTEINKODENDE_SEKVENS = ev.next(), //'DNAType.PROTEINKODENDE_SEKVENS';
    STOP_CODON             = ev.next(),             //'DNAType.STOP_CODON';
    TERMINATOR             = ev.next()              //'DNAType.TERMINATOR';
}

export = DNAType;
