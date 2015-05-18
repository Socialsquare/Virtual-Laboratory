import ev = require('enumvalue');

enum DNAType {
    PROMOTER               = ev.next(),
    RIBOSOME_BINDING_SITE  = ev.next(),
    START_CODON            = ev.next(),
    PROTEINKODENDE_SEKVENS = ev.next(),
    STOP_CODON             = ev.next(),
    TERMINATOR             = ev.next()
}

export = DNAType;
