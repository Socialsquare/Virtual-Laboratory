import ko = require('knockout');
import _ = require('lodash');

import experimentController = require('controller/Experiment');

import BaseComputer = require('controller/view/computer/Base');
import GeneModel = require('model/Gene');
import TubeModel = require('model/Tube');
import DNAElementModel = require('model/DNAElement');

import ComputerScreenType = require('model/type/ComputerScreen');
import ActivationType = require('model/type/Activation');

import DNAService = require('service/DNA');

class DesignDNA extends BaseComputer {

    public defaultAvailableDNA: KnockoutObservableArray<DNAElementModel>;
    public dnaSequence: KnockoutObservableArray<DNAElementModel>;
    public availableDNA: KnockoutComputed<DNAElementModel[]>;

    constructor() {
        super('computer-design-dna', 'computer.screen.dna');

        this.defaultAvailableDNA = ko.observableArray([]);
        this.dnaSequence = ko.observableArray([]);

        this.availableDNA = ko.pureComputed(() => {
            return _.union(this.defaultAvailableDNA(), this.gameState.sequencedDNA());
        });

        this.defaultAvailableDNA(DNAService.getDNAElements());
    }

    public handleDrop = (dna: DNAElementModel) => {
        //TODO: On iPad there is a delay if we do not wait for last draw cycle to complete
        var clone = dna.clone();//TODO: test
        this.dnaSequence.push(clone);
    }

    public moveDnaLeft = (dna: DNAElementModel) => {
        this.moveDna(dna, -1);
    }

    public moveDnaRight = (dna: DNAElementModel) => {
        this.moveDna(dna, 1);
    }

    public moveDna = (dna: DNAElementModel, direction: number) => {
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

    public removeDNA = (dna: DNAElementModel) => {
        this.dnaSequence.remove(dna);
    }

    public showInfo = (dna: DNAElementModel) => {
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

        this.changeScreen(ComputerScreenType.MENU);

        experimentController.triggerActivation(ActivationType.COMPUTER_ORDER_DNA, tube);
    }
}

export = DesignDNA;
