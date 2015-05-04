import ev = require('enumvalue');

enum ProteinCodingSequence {
    NONE              = ev.next(), // 'ProteinCodingSequenceType.NONE',
    ANTIBODY_GOUT     = ev.next(), // 'ProteinCodingSequenceType.ANTIBODY_GOUT',
    ANTIBODY_SMALLPOX = ev.next(), // 'ProteinCodingSequenceType.ANTIBODY_SMALLPOX',
    INSULIN_2         = ev.next(), // 'ProteinCodingSequenceType.INSULIN_2',
    INSULIN_1         = ev.next(), // 'ProteinCodingSequenceType.INSULIN_1',
    GFP               = ev.next(), // 'ProteinCodingSequenceType.GFP',
    LIPASE_ENZYME     = ev.next(), // 'ProteinCodingSequenceType.LIPASE_ENZYME',
    ANTIBIOTIC_RES_A  = ev.next(), // 'ProteinCodingSequenceType.ANTIBIOTIC_RES_A',
    ANTIBIOTIC_RES_B  = ev.next(), // 'ProteinCodingSequenceType.ANTIBIOTIC_RES_B'
}

export = ProteinCodingSequence;
