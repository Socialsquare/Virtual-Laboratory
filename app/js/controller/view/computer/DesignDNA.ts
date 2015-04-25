import ko = require(    'knockout');
import _ = require('lodash');

import BaseComputer = require('controller/view/computer/Base');
import popupController = require('controller/Popup');

import GeneModel = require('model/Gene');
import TubeModel = require('model/Tube');

import dnaService = require('service/DNA');
import utils = require('utils/utils');

class DesignDNA extends BaseComputer {

    constructor() {
        super('computer-design-dna', 'computer.screen.dna');

        this.dnaService = dnaService;
        this.defaultAvailableDNA = ko.observableArray([]);
        this.dnaSequence = ko.observableArray([]);

        this.availableDNA = ko.computed(() => {
            return _.union(this.defaultAvailableDNA(), this.gameState.sequencedDNA());
        });

        this.defaultAvailableDNA(this.dnaService.getDNAElements());
    }

    public handleDrop = (dna) => {
        //TODO: On iPad there is a delay if we do not wait for last draw cycle to complete
        var clone = dna.clone();//TODO: test
        this.dnaSequence.push(clone);
    }

    public moveDnaLeft = (dna) => {
        this.moveDna(dna, -1);
    }

    public moveDnaRight = (dna) => {
        this.moveDna(dna, 1);
    }

    public moveDna = (dna, direction) => {
        var dnaSequence = this.dnaSequence();

        var matchIndex = _.findIndex(dnaSequence, (dnaElement) => dna === dnaElement);

        if (matchIndex === -1) {
            console.log('TODO: dna not found.');
            return;
        } else if (matchIndex === dnaSequence.length - 1 && direction > 0) {
            // Wanting to move right, but dna is already the rightmost element
            return;
        } else if (matchIndex === 0 && direction < 0) {
            return;
        }

        var newIndex = matchIndex + direction;

        // swap this and the one in the given direction
        var tempDna = dnaSequence[newIndex];

        dnaSequence[newIndex] = dna;
        dnaSequence[matchIndex] = tempDna;

        this.dnaSequence(dnaSequence);
    }

    public removeDNA = (dna) => {
        this.dnaSequence.remove(dna);
    }

    public showInfo = (dna) => {
        this.popupController.dnaInfo(dna);
    }

    public orderDNA = () => {
        // clone sequence, add to gene, put in tube
        var sequenceClone = ko.toJS(this.dnaSequence);
        var gene = new GeneModel(sequenceClone);
        var tube = new TubeModel();
        tube.add(gene, true);
        this.gameState.inventory.add(tube);

        // reset the sequence and go to computer menu
        this.dnaSequence.removeAll();

        this.changeScreen(this.Screens.MENU);

        this.experimentController.triggerActivation(this.ActivationType.COMPUTER_ORDER_DNA, tube);
    }
}

export = DesignDNA;
