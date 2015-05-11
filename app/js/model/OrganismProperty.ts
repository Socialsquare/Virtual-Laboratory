import ko = require('knockout');

import LiquidType = require('model/type/Liquid');
import PCSType = require('model/type/ProteinCodingSequence');

import DNAElementModel = require('model/DNAElement');
import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');

class OrganismProperty extends LiquidModel {

    public promoter: KnockoutObservable<any>;
    public proteinCodingSequenceType: KnockoutObservable<PCSType>;
    public proteinCodingSequence: KnockoutObservable<DNAElementModel>;

    constructor(promoter, proteinCodingSequence) {
        super(LiquidType.ORGANISM_PROPERTY, ReactionCount.NEVER, false);

        this.promoter = ko.observable(promoter);
        this.proteinCodingSequenceType = ko.observable(proteinCodingSequence.proteinCodingSequence());
        this.proteinCodingSequence = ko.observable(proteinCodingSequence);

        ko.rebind(this);
    }

    hashCode() {
        return this._hashCode() + ':' + this.promoter().hashCode() + ':' + this.proteinCodingSequence().hashCode();
    }


    clone() {
        var clone = new OrganismProperty(this.promoter(), this.proteinCodingSequence());

        clone.hasReacted(this.hasReacted());

        return clone;
    }
}

export = OrganismProperty;
