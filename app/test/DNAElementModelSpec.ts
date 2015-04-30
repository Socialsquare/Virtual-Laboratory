import DNAElementModel = require('model/DNAElement');
import DNAType = require('model/type/DNA');
import ProteinCodingSequenceType = require('model/type/ProteinCodingSequence');

import dnaData = require('json!testdatadir/dna.json');

describe('DNA element model', () => {

    it('should parse correct values from raw data', () => {

        var dna = new DNAElementModel(dnaData[0]);

        // Check some random values
        expect(dna.icon).toBe("the_icon");
        expect(dna.DNAType()).toBe(DNAType.TERMINATOR);
        expect(dna.proteinCodingSequence()).toBe(ProteinCodingSequenceType.NONE);
        expect(dna.sequence()).toBe("GATTACA");
    });
});
