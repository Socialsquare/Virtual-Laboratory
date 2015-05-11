import ko = require('knockout');
import _ = require('lodash');

import LiquidModel = require('model/Liquid');
import DNAElementModel = require('model/DNAElement');

import LiquidType = require('model/type/Liquid');
import DNAType = require('model/type/DNA');
import ReactionCount = require('model/ReactionCount');


class Gene extends LiquidModel {

    // TODO! type
    public dnaElements: KnockoutObservableArray<DNAElementModel>;

    constructor(elements = []) {
        super(LiquidType.GENE, ReactionCount.NEVER, true);

        this.dnaElements = ko.observableArray(elements);

        ko.rebind(this);
    }

    // Tested/Validated
    getPromoterPositions() {
        var positions: number[] = [];
        _.each(this.dnaElements(), (dna, index) => {
            if(dna.DNAType() === DNAType.PROMOTER) { // dna.DNAType() _IS_ correct, as it is an observable. But when testing this might not be if not created through the computer-view
                positions.push(index);
            }
        });

        return positions;
    }

    // Tested/Validated
    getTerminatorPositions() {
        var positions: number[] = [];
        _.each(this.dnaElements(), (dna, index) => {
            if(dna.DNAType() === DNAType.TERMINATOR) {
                positions.push(index);
            }
        });

        return positions;
    }

    // Tested/Validated
    // Corresponding to step 3 in Patrick's flowchart
    // Extract all "mRNA's" in the gene
    getMRNAs(promPoses: number[], termPoses: number[]): DNAElementModel[][] {
        //starting and end-position in the gene for the mRNA.
        var postionPairs: number[][] = [];
        var mRNAPairs: DNAElementModel[][] = [];

        // Extract position-piars
        while (promPoses.length > 0) {
            var firstPromoter = promPoses.shift();

            //1) nak alle terminals før første promoter.
            termPoses = _.filter(termPoses, (termPos) => {
                return termPos > firstPromoter;
            });

            //2) terminals.shift() !
            var firstTerminal = termPoses.shift();

            //3) nak alle promoters før firstTerminal
            promPoses = _.filter(promPoses, (promPos) => {
                return promPos > firstTerminal;
            });

            postionPairs.push([firstPromoter,firstTerminal]);
        }

        // Extract mRNA
        _(postionPairs).each((pair) => {
            var promPos = pair[0];
            var termPos = pair[1];

            var clone = _.filter(this.dnaElements(), (dna: DNAElementModel, index: number) => {
                return index >= promPos && index < termPos;
            });

            mRNAPairs.push(clone);
        });

        return mRNAPairs;
    }

    hashCode() {
        return this._hashCode() + ":" + _.invoke(this.dnaElements(), 'hashCode').join(',');
    }

    clone() {
        var clone = new Gene(_.invoke(this.dnaElements(), 'clone'));

        clone.hasReacted(this.hasReacted());

        return clone;
    }
}

export = Gene;
