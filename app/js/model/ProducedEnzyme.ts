import ko = require('knockout');

import LiquidType = require('model/type/Liquid');
import PCSType = require('model/type/ProteinCodingSequence');

import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');

class ProducedEnzyme extends LiquidModel {

    public pcsType: PCSType;
    public amount: number;
    public enzymeLiquidType: LiquidType;

    //TODO: dna.name --> dna.PSCtype
    constructor(pcsType, parentGrowthAmount) {
        // call with type = null to properly initialize base class
        super(null, ReactionCount.NEVER, true);

        this.pcsType = pcsType;
        this.amount = parentGrowthAmount;

        //TODO: change to OrganismProperty
        switch (pcsType) {
        case PCSType.ANTIBODY_GOUT:
            this.enzymeLiquidType = LiquidType.ANTIBODY_GOUT;
            break;
        case PCSType.ANTIBODY_SMALLPOX:
            this.enzymeLiquidType = LiquidType.ANTIBODY_SMALLPOX;
            break;
        case PCSType.INSULIN_1:
            this.enzymeLiquidType = LiquidType.INSULIN;
            break;
        case PCSType.INSULIN_2:
            this.enzymeLiquidType = LiquidType.INSULIN;
            break;
        case PCSType.LIPASE_ENZYME: //TODO: Fix in database
            this.enzymeLiquidType = LiquidType.LIPASE_ENZYME;
            break;
        case PCSType.GFP:
            this.enzymeLiquidType = LiquidType.GFP;
            break;
        case PCSType.ANTIBIOTIC_RES_A:
            this.enzymeLiquidType = LiquidType.ANTIBIOTIC;
            break;
        case PCSType.ANTIBIOTIC_RES_B:
            this.enzymeLiquidType = LiquidType.ANTIBIOTIC;
            break;
        default:
            throw 'Unknown type of enzyme: ' + pcsType;
        }

        this.type(this.enzymeLiquidType);

        ko.rebind(this);
    }

    clone() {
        var clone = new ProducedEnzyme(this.pcsType, this.amount);

        clone.enzymeLiquidType = this.enzymeLiquidType;
        clone.hasReacted(this.hasReacted());

        return clone;
    }
}

export = ProducedEnzyme;
