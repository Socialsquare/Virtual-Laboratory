import LiquidFactory = require('factory/Liquid');
import PCSType = require('model/type/ProteinCodingSequence');
import LiquidType = require('model/type/Liquid')
import GeneModel = require('model/Gene');
import DNAService = require('service/DNA');
import Electroporator = require('model/Electroporator')
import MicroorganismModel = require('model/Microorganism');


describe('Electroporator', () => {

    it('Can modify yeast gene with DNA', () => {
        const dnaElements = DNAService.getDNAElements();
        const sequence = [
            dnaElements[7],
            dnaElements[3],
            dnaElements[1],
            dnaElements[6],
            dnaElements[8],
            dnaElements[2],
            dnaElements[0],
        ]
        const yeast = LiquidFactory.microorganism.yeast()
        const gene = new GeneModel(sequence);
        const electroporator = new Electroporator()

        electroporator.add(gene, true)
        electroporator.add(yeast, true)
        electroporator.activate()

        const organism = <MicroorganismModel>electroporator.findByType(LiquidType.MICROORGANISM)
        const extraProperties = organism.extraProperties()
        const codingSequenceTypes = extraProperties.map(p => p.proteinCodingSequenceType())

        // Yeast should have gotten a new property which contains a gene
        // resistance to Antibiotic B
        expect(codingSequenceTypes).toContain(
            PCSType.ANTIBIOTIC_RES_B,
            'The yeast object doesn\'t contain `PCSType.ANTIBIOTIC_RES_B`'
        )
    });
});
