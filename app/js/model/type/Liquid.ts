import ev = require('enumvalue');

enum Liquid {
    MICROORGANISM            = ev.next(),
    ANTIBIOTIC               = ev.next(),
    GROWTH_MEDIUM            = ev.next(),
    DNA                      = ev.next(),
    GENE                     = ev.next(),
    ORGANISM_PROPERTY        = ev.next(),
    JUICE                    = ev.next(),
    BUFFER                   = ev.next(),
    SALT_WATER               = ev.next(),
    MICROTITER_WELLS         = ev.next(),
    DEADLY                   = ev.next(),
    HOMO_SPLEEN              = ev.next(),
    HYBRIDOMA_MEDIUM         = ev.next(),
    INSULIN                  = ev.next(),
    ANTIBODY_GOUT            = ev.next(),
    ANTIBODY_SMALLPOX        = ev.next(),
    ANTIGEN_GOUT             = ev.next(),
    ANTIGEN_SMALLPOX         = ev.next(),
    ADJUVANS                 = ev.next(),
    LIPASE_ENZYME            = ev.next(),
    GFP                      = ev.next(),
    DESIGNED_DRUG            = ev.next(),
    CYP_ENZYME               = ev.next(),
    TARGET_RECEPTOR          = ev.next(),
    PRODUCED_INSULIN         = ev.next(),
    PRODUCED_LIPASE          = ev.next(),
    PRODUCED_ANTIBODY_GOUT   = ev.next(),
    PRODUCED_ANTIBODY_POX    = ev.next(),
    FLUORESCENT_2ND_ANTIBODY = ev.next(),
    MOUSE_BLOOD              = ev.next(),

    BUFFY_COAT               = ev.next(),
    PLASMA                   = ev.next(),
    RED_BLOOD_CELLS          = ev.next(),

    DIABETES_PRIMER          = ev.next(),
    NUCLEOTIDES              = ev.next(),
    PCR_POLYMERASE           = ev.next(),
};

export = Liquid;
