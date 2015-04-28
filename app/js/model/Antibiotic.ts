import ko = require('knockout');
import _ = require('lodash');

import LiquidModel = require('model/Liquid');
import LiquidType = require('model/type/Liquid');
import ReactionCount = require('model/ReactionCount');
import AntibioticType = require('model/type/Antibiotic');
import PCSType = require('model/type/ProteinCodingSequence');

class Antibiotic extends LiquidModel {

    public antibioticType: KnockoutObservable<AntibioticType>;
    public subtype: AntibioticType;

    constructor(antibioticType) {
        super(LiquidType.ANTIBIOTIC, ReactionCount.ALWAYS, false);

        this.antibioticType = ko.observable(antibioticType);
        this.subtype = this.antibioticType;
    }

    //This kills microorganisms without resistance
    public react = (container) => {

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
