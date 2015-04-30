import ko = require('knockout');
import _ = require('lodash');

import LiquidType = require('model/type/Liquid');
import PCSType = require('model/type/ProteinCodingSequence');

import SimpleContainerModel = require('model/SimpleContainer');
import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');
import AntibioticType = require('model/type/Antibiotic');

class Antibiotic extends LiquidModel {

    public antibioticType: KnockoutObservable<AntibioticType>;
    public subtype: KnockoutObservable<AntibioticType>;

    constructor(antibioticType) {
        super(LiquidType.ANTIBIOTIC, ReactionCount.ALWAYS, false);


        // TODO! derp duplicates?
        this.antibioticType = ko.observable(antibioticType);
        this.subtype = ko.observable(antibioticType);
    }

    //This kills microorganisms without resistance
    public react = (container: SimpleContainerModel) => {

        _.each(container.liquids(), (organism) => {
            if (organism.type() !== LiquidType.MICROORGANISM)
                return;

            var resistance =_.any(organism.extraProperties(), (extraProperty) => {

                switch(this.antibioticType()){
                case AntibioticType.A:
                    return extraProperty.proteinCodingSequenceType() === PCSType.ANTIBIOTIC_RES_A;
                case AntibioticType.B:
                    return extraProperty.proteinCodingSequenceType() === PCSType.ANTIBIOTIC_RES_B;
                default:
                    throw 'Unknown antibioticType: ' + this.antibioticType();
                }
            });

            if(!resistance) {
                organism.living(false);
            }
        });
    }

    public hashCode = () => {
        return this._hashCode() + ":" + this.antibioticType();
    }

    public clone = () => {
        var clone = new Antibiotic(this.antibioticType());

        clone.hasReacted(this.hasReacted());

        return clone;
    }
}

export = Antibiotic;
