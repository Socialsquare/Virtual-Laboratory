import ko = require('knockout');
import _ = require('lodash');

import BaseComputer = require('controller/view/computer/Base');
import popupController = require('controller/Popup');
import experimentController = require('controller/Experiment');

import TubeModel = require('model/Tube');
import DNAElementModel = require('model/DNAElement');
import gameState = require('model/GameState');
import LiquidType = require('model/type/Liquid');
import MicroorganismType = require('model/type/Microorganism');
import ActivationType = require('model/type/Activation');

import LocalizationService = require('service/Localization');
import LiquidHelper = require('utils/LiquidHelper');
import DNAService = require('service/DNA');


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

        if (!tube.containsMicroorganism(MicroorganismType.MYELOMA)) {
            this.isValid(false);
            popupController.message('computer.screen.sequencing.fail_header', 'computer.screen.sequencing.missing_myeloma');
            return;
        }

        if (!tube.well || !tube.well.hasAntibody()) {
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

        var alreadySequenced = _.any(gameState.sequencedDNA(), (sequencedDNA) => {
            return sequencedDNA.name() === dna.name();
        });

        if (!alreadySequenced) {
            gameState.sequencedDNA.push(dna);
        }

        experimentController.triggerActivation(ActivationType.COMPUTER_ORDER_SEQUENCE, dna);
    }

    createDNAElement(liquidType) {
        return DNAService.createDNAElementForLiquid(liquidType);
    }
}

export = Sequencing;
