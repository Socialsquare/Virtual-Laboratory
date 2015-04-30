import ko = require('knockout');

import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');

import LiquidType = require('model/type/Liquid');
import DNAType = require('model/type/DNA');
import PCSType = require('model/type/ProteinCodingSequence');

class DNAElement extends LiquidModel {

    public DNAType: KnockoutObservable<DNAType>;

    public proteinCodingSequence: KnockoutObservable<PCSType>;
	public icon: KnockoutObservable<string>;
	public name: KnockoutObservable<string>;
	public color: KnockoutObservable<string>;
	public sequence: KnockoutObservable<string>;
	public description: KnockoutObservable<string>;
	public link: KnockoutObservable<string>;
	public comment: KnockoutObservable<string>;

    constructor(values) {
        super(LiquidType.DNA, ReactionCount.ALWAYS, true);

		this.DNAType = ko.observable(DNAType.fromInt(values.type));

        this.proteinCodingSequence = ko.observable(values.proteinCodingSequence);
		this.icon = values.icon;
		this.name = ko.observable(values.name);
		this.color = ko.observable(values.color);
		this.sequence = ko.observable(values.sequence);
		this.description = ko.observable(values.description);
		this.link = ko.observable(values.link);
		this.comment = ko.observable(values.comment);
    }

    public hashCode = () => {
        return this._hashCode() + ":" + this.name() + ":" + this.DNAType();
    }

    public clone = () => {
        var clone = new DNAElement({
            type: 0,
            name: this.name(),
            color: this.color(),
            sequence: this.sequence(),
            description: this.description(),
            link: this.link(),
            comment: this.comment(),
            proteinCodingSequence: this.proteinCodingSequence()
        });

        clone.DNAType(this.DNAType());
        clone.hasReacted(this.hasReacted());

        return clone;
    }
}

export = DNAElement;
