import ko = require('knockout');
import _ = require('lodash');

import BaseComputer = require('controller/view/computer/Base');
import popupController = require('controller/Popup');
import experimentController = require('controller/Experiment');

import TubeModel = require('model/Tube');
import DNAElementModel = require('model/DNAElement');

import LiquidType = require('model/type/Liquid');
import MicroorganismType = require('model/type/Microorganism');
import ActivationType = require('model/type/Activation');

import LocalizationService = require('service/Localization');
import LiquidHelper = require('utils/LiquidHelper');

class Sequencing extends BaseComputer {

    public isValid: KnockoutObservable<boolean>;
    public message: KnockoutObservable<string>;
    public item: TubeModel;
    public consumeItem: () => void;

    constructor() {
        super('computer-sequencing', 'computer.screen.sequencing');

        this.isValid = ko.observable(false);
        this.message = ko.observable('');
        this.item = null;
        this.consumeItem = _.noop;

        ko.rebind(this);
    }

    handleDrop(item, consumer) {

        this.item = item;
        this.consumeItem = consumer;
        this.isValid(true);

        this.sendToSequencing(item);

        this.consumeItem();

        return false;
    }

    sendToSequencing(tube: TubeModel) {
        if (!tube) return;
        // reset message and create new dna element
        var dna = null;
        //TODO: uncomment! //TODO: figure how to get the optimal concentration from dilution

        console.log('TODO: tube.getTotalConc: ' + tube.getTotalConcentration());

        if (tube.getTotalConcentration() > 48) {
            this.isValid(false);
            popupController.message('computer.screen.sequencing.fail_header', 'computer.screen.sequencing.invalid_concentration');
            return;
        }

        if (!tube.containsMicroorganism(MicroorganismType.MYELOMA)) {
            this.isValid(false);
            popupController.message('computer.screen.sequencing.fail_header', 'computer.screen.sequencing.missing_myeloma');
            return;
        }

        if (!tube.hasOwnProperty('well') || !tube.well.hasAntibody()) {
            console.log('TODO: remove #1');
            this.isValid(false);
            popupController.message('computer.screen.sequencing.fail_header', 'computer.screen.sequencing.missing_antibody');
            return;
        }

        var myelomas = LiquidHelper.myelomas(tube.liquids());
        var myelomasWithAntibodies = _.filter(myelomas, (myeloma) => {
            return myeloma.antibodiesFor().length > 0;
        });

        var antibodies = _(myelomasWithAntibodies)
            .map(myeloma => myeloma.antibodiesFor())
            .flatten()
            .value();

        // TODO: if antibodies above can be confirmed (test!) equal to below, remove!
        // var antibodies = _.reduce(myelomasWithAntibodies, (acc, myeloma) => {
        //     _.each(myeloma.antibodiesFor(), (antibodyString) => {
        //         acc.push(antibodyString);
        //     });

        //     return acc;
        // }, []);

        antibodies = _.unique(antibodies);

        if (_.contains(antibodies, LiquidType.ANTIBODY_GOUT)) {
            dna = this.createDNAElement(LiquidType.ANTIBODY_GOUT);
            popupController.message('computer.screen.sequencing.created_gout.header',
                                    'computer.screen.sequencing.created_gout.body');
        } else { //if (_.contains(antibodies, LiquidType.ANTIBODY_SMALLPOX)) {
            dna = this.createDNAElement(LiquidType.ANTIBODY_SMALLPOX);
            popupController.message('computer.screen.sequencing.created_smallpox.header',
                                    'computer.screen.sequencing.created_smallpox.body');
        }

        var alreadySequenced = _.any(this.gameState.sequencedDNA(), (sequencedDNA) => {
            return sequencedDNA.name() === dna.name();
        });

        if (!alreadySequenced) {
            this.gameState.sequencedDNA.push(dna);
        }

        experimentController.triggerActivation(ActivationType.COMPUTER_ORDER_SEQUENCE, dna);
    }

    createDNAElement(type) {
        var icon = 'assets/images/icon_dna_dummy.png';
        var name = '';
        var pscType = '';
        var id = '';
        var link = '';
        var sequence = 'GATACA';
        switch (type) {
        case LiquidType.ANTIBODY_GOUT:
            name = LocalizationService.text('liquid.name.antibody_gout');
            pscType = 'ProteinCodingSequenceType.ANTIBODY_GOUT';
            id = 'DNA_ANTIBODY_GOUT';
            break;

        case LiquidType.ANTIBODY_SMALLPOX:
            name = LocalizationService.text('liquid.name.antibody_smallpox');
            pscType = 'ProteinCodingSequenceType.ANTIBODY_SMALLPOX';
            id = 'DNA_ANTIBODY_SMALLPOX';
            link = 'http://www.google.com/patents/EP2061511A2?cl=en';
            sequence = 'aactatcatgtgcatctgatgtggcgcgatggcgataccagctataacccgaccctgaaaagcggcagcgaatattatggcctgctgggctatgtgatgggcgcgaaagcgagcaaaagcattagcaaaagcctggcgagcggcagcaccctgcagagccagcagcataacgaatatccggtgacc';
            break;

        default:
            throw 'Invalid dna element type: ' + type;
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

        return new DNAElementModel(dnaData);
    }
}

export = Sequencing;
