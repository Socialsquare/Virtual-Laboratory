import _ = require('lodash');

import DNAElement = require('model/DNAElement');
import DNAData = require('json!datadir/dna.json');
import LiquidType = require('model/type/Liquid');
import LocalizationService = require('service/Localization');


class DNAService {

    static getDNAElements() {
        return _.map(DNAData, (element) => {
            return new DNAElement(element);
        });
    }

    static createDNAElementForLiquid(ltype){
        var icon = 'assets/images/icon_dna_dummy.png';
        var name = '';
        var pscType = '';
        var id = '';
        var link = '';
        var sequence = 'GATACA';
        switch (ltype) {
        case LiquidType.ANTIBODY_GOUT:
            name = 'liquid.name.antibody_gout';
            pscType = 'ProteinCodingSequenceType.ANTIBODY_GOUT';
            id = 'DNA_ANTIBODY_GOUT';
            break;

        case LiquidType.ANTIBODY_SMALLPOX:
            name = 'liquid.name.antibody_smallpox';
            pscType = 'ProteinCodingSequenceType.ANTIBODY_SMALLPOX';
            id = 'DNA_ANTIBODY_SMALLPOX';
            link = 'http://www.google.com/patents/EP2061511A2?cl=en';
            sequence = 'aactatcatgtgcatctgatgtggcgcgatggcgataccagctataacccgaccctgaaaagcggcagcgaatattatggcctgctgggctatgtgatgggcgcgaaagcgagcaaaagcattagcaaaagcctggcgagcggcagcaccctgcagagccagcagcataacgaatatccggtgacc';
            break;

        default:
            throw 'Invalid dna element type: ' + ltype;
        }

        // TODO: correct values
        var dnaData = {
            icon: icon,
            type: 3,
            comment: '',
            link: link,
            description: '',
            sequence: 'GATTACA',
            color: '#80c0f7',
            name: name,
            proteinCodingSequence: pscType
        };

        return new DNAElement(dnaData);
    }
}

export = DNAService;
