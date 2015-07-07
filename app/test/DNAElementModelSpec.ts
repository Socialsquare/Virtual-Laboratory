import DNAElementModel = require('model/DNAElement');
import DNAType = require('model/type/DNA');
import ProteinCodingSequenceType = require('model/type/ProteinCodingSequence');

import dnaData = require('json!testdatadir/dna.json');

describe('DNA element model', () => {

    it('should parse correct values from raw data', () => {
        var dna = new DNAElementModel(dnaData[0]);

        // Check some random values
        expect(dna.icon()).toBe("the_icon");
        expect(dna.DNAType()).toBe(DNAType.TERMINATOR);
        expect(dna.proteinCodingSequence()).toBe(ProteinCodingSequenceType.ANTIBODY_SMALLPOX);
        expect(dna.sequence()).toBe("GATTACA");
    });

    it('should clone values', () => {
        var dna = new DNAElementModel(dnaData[0]);
        var clone = dna.clone();

        // values should be identical to above
        expect(clone.icon()).toBe("the_icon");
        expect(clone.DNAType()).toBe(DNAType.TERMINATOR);
        expect(clone.proteinCodingSequence()).toBe(ProteinCodingSequenceType.ANTIBODY_SMALLPOX);
        expect(clone.sequence()).toBe("GATTACA");
    });
});
