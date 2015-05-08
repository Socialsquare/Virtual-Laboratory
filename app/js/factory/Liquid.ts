import ko = require('knockout');

import Liquid = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');
import Microorganism = require('model/Microorganism');
import MyelomaModel = require('model/Myeloma');
import Antibiotic = require('model/Antibiotic');
import HomogenizedSpleen = require('model/HomogenizedSpleen');
import SaltWater = require('model/SaltWater');
import FluorescentSecondaryAntibody = require('model/FluorescentSecondaryAntibody');

import MicroorganismType = require('model/type/Microorganism');
import AntibioticType = require('model/type/Antibiotic');
import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

class LiquidFactory {

    static microorganism = {
        yeast: () => {
            var micro = new Microorganism(MicroorganismType.YEAST);

            micro.living(true);
            micro.extraGenes([]);
            micro.extraProperties([]);
            micro.optimalPh(6.0);
            micro.optimalTemp(35);
            micro.concentration(Math.pow(10, 8));


            return micro;
        },

        myeloma: () => {
            return new MyelomaModel();
        }
    };

    static antibiotic = {
        a: () => {
            var anti = new Antibiotic(AntibioticType.A);

            return anti;
        },

        b: () => {
            var anti = new Antibiotic(AntibioticType.B);

            return anti;
        }
    };

    static homoSpleen = (antibody) => {
        var homogenizedSpleen = new HomogenizedSpleen();

        homogenizedSpleen.antibodiesFor.push(antibody);
        return homogenizedSpleen;
    };

    static hybridomaMedium = () => {
        return new Liquid(LiquidType.HYBRIDOMA_MEDIUM);
    };

    static growthMedium = () => {
        return new Liquid(LiquidType.GROWTH_MEDIUM);
    };

    static deadly = () => {
        return new Liquid(LiquidType.DEADLY, ReactionCount.ALWAYS);
    };

    static fluorescentSecondaryAntibody = () => {
        return new FluorescentSecondaryAntibody();
    };

    static insulin = () => {
        return new Liquid(LiquidType.INSULIN);
    };

    static antigenGout = () => {
        return new Liquid(LiquidType.ANTIGEN_GOUT);
    };

    static antigenSmallpox = () => {
        return new Liquid(LiquidType.ANTIGEN_SMALLPOX);
    };

    static antibodySmallpox = () => {
        return new Liquid(LiquidType.ANTIBODY_SMALLPOX);
    };

    static antibodyGout = () => {
        return new Liquid(LiquidType.ANTIBODY_GOUT);
    };

    static adjuvans = () => {
        return new Liquid(LiquidType.ADJUVANS);
    };

    static lipase = () => {
        return new Liquid(LiquidType.LIPASE_ENZYME);
    };

    static gfp = () => {
        return new Liquid(LiquidType.GFP);
    };

    static cypEnzyme = () => {
        return new Liquid(LiquidType.CYP_ENZYME);
    };

    static targetRecptor = () => {
        return new Liquid(LiquidType.TARGET_RECEPTOR);
    };

    static juice = () => {
        return new Liquid(LiquidType.JUICE, ReactionCount.ALWAYS);
    };

    static saltWater = () => {
        return new SaltWater();
    };

    static mouseBlood = (mouseBloodType: MouseBloodType) => {
        var blood = new Liquid(LiquidType.MOUSE_BLOOD);
        blood.subtype(mouseBloodType);
        return blood;
    };

    static diabetesPrimer = () => {
        return new Liquid(LiquidType.DIABETES_PRIMER);
    }

    static nucleotides = () => {
        return new Liquid(LiquidType.NUCLEOTIDES);
    }

    static pcrPolymerase = () => {
        return new Liquid(LiquidType.PCR_POLYMERASE);
    }

    static blueStain = () => {
        return new Liquid(LiquidType.BLUE_STAIN);
    }
}

export = LiquidFactory;
