import ConsequenceType = require('model/type/Consequence');
import TriggerType = require('model/type/Trigger');
import ActivationType = require('model/type/Activation');
import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import MicroorganismType = require('model/type/Microorganism');
import AntibioticType = require('model/type/Antibiotic');
import LocationType = require('model/type/Location');
import AntigenCoatingType = require('model/type/AntigenCoating');
import DNAType = require('model/type/DNA');
import ProteinCodingSequenceType = require('model/type/ProteinCodingSequence');
import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');

class S2T {

    static consequence(s: string) {
        switch (s) {
        case 'ConsequenceType.QUIZ': return ConsequenceType.QUIZ;
        case 'ConsequenceType.VIDEO': return ConsequenceType.VIDEO;
        case 'ConsequenceType.QUIZ_VIDEO': return ConsequenceType.QUIZ_VIDEO;
        default: return null;
        }
    }

    static mouseBlood(s: string) {
        switch (s) {
        case 'MouseBloodType.NORMAL': return MouseBloodType.NORMAL;
        case 'MouseBloodType.DIABETIC': return MouseBloodType.DIABETIC;
        default: return null;
        }
    }

    static mouse(s: string) {
        switch (s) {
        case 'MouseType.HEALTHY': return MouseType.HEALTHY;
        case 'MouseType.GOUT': return MouseType.GOUT;
        case 'MouseType.SMALLPOX': return MouseType.SMALLPOX;
        case 'MouseType.INSOMNIA': return MouseType.INSOMNIA;
        case 'MouseType.PSORIASIS': return MouseType.PSORIASIS;
        default: return null;
        }
    }

    static trigger(s: string) {
        switch (s) {
        case 'TriggerType.MIX': return TriggerType.MIX;
        case 'TriggerType.MOUSE': return TriggerType.MOUSE;
        case 'TriggerType.ACTIVATION': return TriggerType.ACTIVATION;
        case 'TriggerType.ACQUIRE': return TriggerType.ACQUIRE;
        default: return null;
        }
    }

    static activation(s: string) {
        switch (s) {
        case 'ActivationType.WASHING': return ActivationType.WASHING;
        case 'ActivationType.INCUBATOR': return ActivationType.INCUBATOR;
        case 'ActivationType.COMPUTER_ORDER_DNA': return ActivationType.COMPUTER_ORDER_DNA;
        case 'ActivationType.COMPUTER_ORDER_MOUSE': return ActivationType.COMPUTER_ORDER_MOUSE;
        case 'ActivationType.COMPUTER_ORDER_SEQUENCE': return ActivationType.COMPUTER_ORDER_SEQUENCE;
        case 'ActivationType.COMPUTER_ORDER_DRUG': return ActivationType.COMPUTER_ORDER_DRUG;
        case 'ActivationType.BUNSEN': return ActivationType.BUNSEN;
        case 'ActivationType.ELECTROPORATOR': return ActivationType.ELECTROPORATOR;
        case 'ActivationType.HEATER': return ActivationType.HEATER;
        case 'ActivationType.OD': return ActivationType.OD;
        case 'ActivationType.BLENDER': return ActivationType.BLENDER;
        case 'ActivationType.FERMENTOR': return ActivationType.FERMENTOR;
        case 'ActivationType.SPECTROPM': return ActivationType.SPECTROPM;
        default: return null;
        }
    }

    static container(s: string) {
        switch (s) {
            // Simple
        case 'ContainerType.PETRI_DISH': return ContainerType.PETRI_DISH;
        case 'ContainerType.MICROTITER': return ContainerType.MICROTITER;
        case 'ContainerType.TUBE': return ContainerType.TUBE;
        case 'ContainerType.BOTTLE': return ContainerType.BOTTLE;
        case 'ContainerType.SYRINGE': return ContainerType.SYRINGE;
        case 'ContainerType.PIPETTE_TIP': return ContainerType.PIPETTE_TIP;
            // Composite
        case 'ContainerType.PETRI_SPACE': return ContainerType.PETRI_SPACE;
        case 'ContainerType.MICRO_SPACE': return ContainerType.MICRO_SPACE;
        case 'ContainerType.TUBE_RACK': return ContainerType.TUBE_RACK;
        case 'ContainerType.UV_PETRI_SPACE': return ContainerType.UV_PETRI_SPACE;
        case 'ContainerType.UV_MICRO_SPACE': return ContainerType.UV_MICRO_SPACE;
        case 'ContainerType.UV_TUBE_RACK': return ContainerType.UV_TUBE_RACK;

            // Simple machines
        case 'ContainerType.BLENDER': return ContainerType.BLENDER;
        case 'ContainerType.ELECTROPORATOR': return ContainerType.ELECTROPORATOR;
        case 'ContainerType.FERMENTOR_TANK': return ContainerType.FERMENTOR_TANK;
        case 'ContainerType.WASHING_TANK': return ContainerType.WASHING_TANK;

            // Composite machines
        case 'ContainerType.HEATER': return ContainerType.HEATER;
        case 'ContainerType.OD_MACHINE': return ContainerType.OD_MACHINE;
        case 'ContainerType.SPECTROPM_MACHINE': return ContainerType.SPECTROPM_MACHINE;
        case 'ContainerType.PIPETTE': return ContainerType.PIPETTE;
        case 'ContainerType.FERMENTOR': return ContainerType.FERMENTOR;
        case 'ContainerType.CENTRIFUGE': return ContainerType.CENTRIFUGE;
        default: return null;
        }
    }

    static liquid(s: string) {
        switch (s) {
        case 'LiquidType.MICROORGANISM':
            return LiquidType.MICROORGANISM;
        case 'LiquidType.ANTIBIOTIC':
            return LiquidType.ANTIBIOTIC;
        case 'LiquidType.GROWTH_MEDIUM':
            return LiquidType.GROWTH_MEDIUM;
        case 'LiquidType.DNA':
            return LiquidType.DNA;
        case 'LiquidType.GENE':
            return LiquidType.GENE;
        case 'LiquidType.ORGANISM_PROPERTY':
            return LiquidType.ORGANISM_PROPERTY;
        case 'LiquidType.JUICE':
            return LiquidType.JUICE;
        case 'LiquidType.SALT_WATER':
            return LiquidType.SALT_WATER;
        case 'LiquidType.MICROTITER_WELLS':
            return LiquidType.MICROTITER_WELLS;
        case 'LiquidType.DEADLY':
            return LiquidType.DEADLY;
        case 'LiquidType.HOMO_SPLEEN':
            return LiquidType.HOMO_SPLEEN;
        case 'LiquidType.HYBRIDOMA_MEDIUM':
            return LiquidType.HYBRIDOMA_MEDIUM;
        case 'LiquidType.INSULIN':
            return LiquidType.INSULIN;
        case 'LiquidType.ANTIBODY_GOUT':
            return LiquidType.ANTIBODY_GOUT;
        case 'LiquidType.ANTIBODY_SMALLPOX':
            return LiquidType.ANTIBODY_SMALLPOX;
        case 'LiquidType.ANTIGEN_GOUT':
            return LiquidType.ANTIGEN_GOUT;
        case 'LiquidType.ANTIGEN_SMALLPOX':
            return LiquidType.ANTIGEN_SMALLPOX;
        case 'LiquidType.ADJUVANS':
            return LiquidType.ADJUVANS;
        case 'LiquidType.LIPASE_ENZYME':
            return LiquidType.LIPASE_ENZYME;
        case 'LiquidType.GFP':
            return LiquidType.GFP;
        case 'LiquidType.DESIGNED_DRUG':
            return LiquidType.DESIGNED_DRUG;
        case 'LiquidType.CYP_ENZYME':
            return LiquidType.CYP_ENZYME;
        case 'LiquidType.TARGET_RECEPTOR':
            return LiquidType.TARGET_RECEPTOR;
        case 'LiquidType.PRODUCED_INSULIN':
            return LiquidType.PRODUCED_INSULIN;
        case 'LiquidType.PRODUCED_LIPASE':
            return LiquidType.PRODUCED_LIPASE;
        case 'LiquidType.PRODUCED_ANTIBODY_GOUT':
            return LiquidType.PRODUCED_ANTIBODY_GOUT;
        case 'LiquidType.PRODUCED_ANTIBODY_POX':
            return LiquidType.PRODUCED_ANTIBODY_POX;
        case 'LiquidType.FLUORESCENT_2ND_ANTIBODY':
            return LiquidType.FLUORESCENT_2ND_ANTIBODY;

        case 'LiquidType.MOUSE_BLOOD':
            return LiquidType.MOUSE_BLOOD;
        case 'LiquidType.BUFFY_COAT':
            return LiquidType.BUFFY_COAT;
        case 'LiquidType.RED_BLOOD_CELLS':
            return LiquidType.RED_BLOOD_CELLS;
        case 'LiquidType.PLASMA':
            return LiquidType.PLASMA;

        case 'LiquidType.DIABETES_PRIMER':
            return LiquidType.DIABETES_PRIMER;
        case 'LiquidType.NUCLEOTIDES':
            return LiquidType.NUCLEOTIDES;
        case 'LiquidType.DNA_POLYMERASE':
            return LiquidType.DNA_POLYMERASE;
        case 'LiquidType.BLUE_STAIN':
            return LiquidType.BLUE_STAIN;
        case 'LiquidType.LYSIS':
            return LiquidType.LYSIS;
        case 'LiquidType.FREE_FLOATING_DNA':
            return LiquidType.FREE_FLOATING_DNA;
        case 'LiquidType.CLUMPED_CELLS':
            return LiquidType.CLUMPED_CELLS;

        default: return null;
        }
    }

    static microorganism(s: string) {
        switch (s) {
        case 'MicroorganismType.YEAST': return MicroorganismType.YEAST;
        case 'MicroorganismType.MYELOMA': return MicroorganismType.MYELOMA;
        default: return null;
        }
    }

    static antibiotic(s: string) {
        switch (s) {
        case 'AntibioticType.A': return AntibioticType.A;
        case 'AntibioticType.B': return AntibioticType.B;
        default: return null;
        }
    }

    static loc(s: string) {
        switch (s) {
        case 'LocationType.CHEMICAL': return LocationType.CHEMICAL;
        case 'LocationType.COMPUTER': return LocationType.COMPUTER;
        case 'LocationType.FERMENTOR': return LocationType.FERMENTOR;
        case 'LocationType.FERMENTORSCREEN': return LocationType.FERMENTORSCREEN;
        case 'LocationType.FUMEHOOD': return LocationType.FUMEHOOD;
        case 'LocationType.INCUBATOR': return LocationType.INCUBATOR;
        case 'LocationType.LOADING': return LocationType.LOADING;
        case 'LocationType.MOUSE': return LocationType.MOUSE;
        case 'LocationType.OVERVIEW': return LocationType.OVERVIEW;
        case 'LocationType.SPECTROPM': return LocationType.SPECTROPM;
        case 'LocationType.SPECTROPMSCREEN': return LocationType.SPECTROPMSCREEN;
        case 'LocationType.UVROOM': return LocationType.UVROOM;
        case 'LocationType.WASHING': return LocationType.WASHING;
        case 'LocationType.WORKTABLE1': return LocationType.WORKTABLE1;
        case 'LocationType.WORKTABLE2': return LocationType.WORKTABLE2;
        case 'LocationType.INVENTORY': return LocationType.INVENTORY;
        default: return null;
        }
    }

    static antigenCoating(s: string) {
        switch (s) {
        case 'AntigenCoatingType.ANY': return AntigenCoatingType.ANY;
        case 'AntigenCoatingType.NONE': return AntigenCoatingType.NONE;
        default: return null;
        }
    }

    static dnaFromId(id: string) {
        var lookup = [
            DNAType.PROMOTER,
            DNAType.RIBOSOME_BINDING_SITE,
            DNAType.START_CODON,
            DNAType.PROTEINKODENDE_SEKVENS,
            DNAType.STOP_CODON,
            DNAType.TERMINATOR
        ];

        return lookup[id];
    }

    static pcs(s: string) {
        switch (s) {
        case 'ProteinCodingSequenceType.NONE':
            return ProteinCodingSequenceType.NONE;
        case 'ProteinCodingSequenceType.ANTIBODY_GOUT':
            return ProteinCodingSequenceType.ANTIBODY_GOUT;
        case 'ProteinCodingSequenceType.ANTIBODY_SMALLPOX':
            return ProteinCodingSequenceType.ANTIBODY_SMALLPOX;
        case 'ProteinCodingSequenceType.INSULIN_2':
            return ProteinCodingSequenceType.INSULIN_2;
        case 'ProteinCodingSequenceType.INSULIN_1':
            return ProteinCodingSequenceType.INSULIN_1;
        case 'ProteinCodingSequenceType.GFP':
            return ProteinCodingSequenceType.GFP;
        case 'ProteinCodingSequenceType.LIPASE_ENZYME':
            return ProteinCodingSequenceType.LIPASE_ENZYME;
        case 'ProteinCodingSequenceType.ANTIBIOTIC_RES_A':
            return ProteinCodingSequenceType.ANTIBIOTIC_RES_A;
        case 'ProteinCodingSequenceType.ANTIBIOTIC_RES_B':
            return ProteinCodingSequenceType.ANTIBIOTIC_RES_B;
        default: return null;
        }
    }
}

export = S2T;
