import ConsequenceType = require('model/type/Consequence');
import TriggerType = require('model/type/Trigger');
import ActivationType = require('model/type/Activation');
import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import MicroorganismType = require('model/type/Microorganism');
import AntibioticType = require('model/type/Antibiotic');
import LocationType = require('model/type/Location');
import AntigenCoatingType = require('model/type/AntigenCoating');

class S2T {

    static consequence = (s: string) => {
        switch (s) {
        case "ConsequenceType.QUIZ": return ConsequenceType.QUIZ;
        case "ConsequenceType.VIDEO":  return ConsequenceType.VIDEO;
        case "ConsequenceType.QUIZ_VIDEO":  return ConsequenceType.QUIZ_VIDEO;
        default: return null;
// default: throw "Unknown consequence string: " + s;
        }
    };

    static trigger = (s: string) => {
        switch (s) {
        case "TriggerType.MIX": return TriggerType.MIX;
        case "TriggerType.MOUSE": return TriggerType.MOUSE;
        case "TriggerType.ACTIVATION": return TriggerType.ACTIVATION;
        case "TriggerType.ACQUIRE": return TriggerType.ACQUIRE;
        default: return null;
// default: throw "Unknown trigger string: " + s;
        }
    };

    static activation = (s: string) => {
        switch (s) {
        case "ActivationType.WASHING": return ActivationType.WASHING;
        case "ActivationType.INCUBATOR": return ActivationType.INCUBATOR;
        case "ActivationType.COMPUTER_ORDER_DNA": return ActivationType.COMPUTER_ORDER_DNA;
        case "ActivationType.COMPUTER_ORDER_MOUSE": return ActivationType.COMPUTER_ORDER_MOUSE;
        case "ActivationType.COMPUTER_ORDER_SEQUENCE": return ActivationType.COMPUTER_ORDER_SEQUENCE;
        case "ActivationType.COMPUTER_ORDER_DRUG": return ActivationType.COMPUTER_ORDER_DRUG;
        case "ActivationType.BUNSEN": return ActivationType.BUNSEN;
        case "ActivationType.ELECTROPORATOR": return ActivationType.ELECTROPORATOR;
        case "ActivationType.HEATER": return ActivationType.HEATER;
        case "ActivationType.OD": return ActivationType.OD;
        case "ActivationType.BLENDER": return ActivationType.BLENDER;
        case "ActivationType.FERMENTOR": return ActivationType.FERMENTOR;
        case "ActivationType.SPECTROPM": return ActivationType.SPECTROPM;
        default: return null;
// default: throw "Unknown activation string: " + s;
        }
    };

    static container = (s: string) => {
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
        default: return null;
// default: throw "Unknown container string: " + s;
        }
    };

    static liquid = (s: string) => {
        switch (s) {
        case "LiquidType.MICROORGANISM": return LiquidType.MICROORGANISM;
        case "LiquidType.ANTIBIOTIC": return LiquidType.ANTIBIOTIC;
        case "LiquidType.GROWTH_MEDIUM": return LiquidType.GROWTH_MEDIUM;
        case "LiquidType.DNA": return LiquidType.DNA;
        case "LiquidType.GENE": return LiquidType.GENE;
        case "LiquidType.ORGANISM_PROPERTY": return LiquidType.ORGANISM_PROPERTY;
        case "LiquidType.JUICE": return LiquidType.JUICE;
        case "LiquidType.BUFFER": return LiquidType.BUFFER;
        case "LiquidType.SALT_WATER": return LiquidType.SALT_WATER;
        case "LiquidType.MICROTITER_WELLS": return LiquidType.MICROTITER_WELLS;
        case "LiquidType.DEADLY": return LiquidType.DEADLY;
        case "LiquidType.HOMO_SPLEEN": return LiquidType.HOMO_SPLEEN;
        case "LiquidType.HYBRIDOMA_MEDIUM": return LiquidType.HYBRIDOMA_MEDIUM;
        case "LiquidType.INSULIN": return LiquidType.INSULIN;
        case "LiquidType.ANTIBODY_GOUT": return LiquidType.ANTIBODY_GOUT;
        case "LiquidType.ANTIBODY_SMALLPOX": return LiquidType.ANTIBODY_SMALLPOX;
        case "LiquidType.ANTIGEN_GOUT": return LiquidType.ANTIGEN_GOUT;
        case "LiquidType.ANTIGEN_SMALLPOX": return LiquidType.ANTIGEN_SMALLPOX;
        case "LiquidType.ADJUVANS": return LiquidType.ADJUVANS;
        case "LiquidType.LIPASE_ENZYME": return LiquidType.LIPASE_ENZYME;
        case "LiquidType.GFP": return LiquidType.GFP;
        case "LiquidType.DESIGNED_DRUG": return LiquidType.DESIGNED_DRUG;
        case "LiquidType.CYP_ENZYME": return LiquidType.CYP_ENZYME;
        case "LiquidType.TARGET_RECEPTOR": return LiquidType.TARGET_RECEPTOR;
        case "LiquidType.PRODUCED_INSULIN": return LiquidType.PRODUCED_INSULIN;
        case "LiquidType.PRODUCED_LIPASE": return LiquidType.PRODUCED_LIPASE;
        case "LiquidType.PRODUCED_ANTIBODY_GOUT": return LiquidType.PRODUCED_ANTIBODY_GOUT;
        case "LiquidType.PRODUCED_ANTIBODY_POX": return LiquidType.PRODUCED_ANTIBODY_POX;
        case "LiquidType.FLUORESCENT_2ND_ANTIBODY": return LiquidType.FLUORESCENT_2ND_ANTIBODY;
        default: return null;
// default: throw "Unknown liquid string: " + s;
        }
    };

    static microorganism = (s: string) => {
        switch (s) {
        case "MicroorganismType.YEAST": return MicroorganismType.YEAST;
        case "MicroorganismType.MYELOMA": return MicroorganismType.MYELOMA;
        default: return null;
// default: throw "Unknown microorganism string: " + s;
        }
    };

    static antibiotic = (s: string) => {
        switch (s) {
        case 'AntibioticType.A': return AntibioticType.A;
        case 'AntibioticType.B': return AntibioticType.B;
        default: return null;
// default: throw "Unknown antibiotic string: " + s;
        }
    };

    static loc = (s: string) => {
        switch (s) {
        case "LocationType.CHEMICAL": return LocationType.CHEMICAL;
        case "LocationType.COMPUTER": return LocationType.COMPUTER;
        case "LocationType.FERMENTOR": return LocationType.FERMENTOR;
        case "LocationType.FERMENTORSCREEN": return LocationType.FERMENTORSCREEN;
        case "LocationType.FUMEHOOD": return LocationType.FUMEHOOD;
        case "LocationType.INCUBATOR": return LocationType.INCUBATOR;
        case "LocationType.LOADING": return LocationType.LOADING;
        case "LocationType.MOUSE": return LocationType.MOUSE;
        case "LocationType.OVERVIEW": return LocationType.OVERVIEW;
        case "LocationType.SPECTROPM": return LocationType.SPECTROPM;
        case "LocationType.SPECTROPMSCREEN": return LocationType.SPECTROPMSCREEN;
        case "LocationType.UVROOM": return LocationType.UVROOM;
        case "LocationType.WASHING": return LocationType.WASHING;
        case "LocationType.WORKTABLE1": return LocationType.WORKTABLE1;
        case "LocationType.WORKTABLE2": return LocationType.WORKTABLE2;
        case "LocationType.INVENTORY": return LocationType.INVENTORY;
        default: return null;
// default: throw "Unknown location string: " + s;
        }
    };

    static antigenCoating = (s: string) => {
        switch (s) {
        case 'AntigenCoatingType.ANY': return AntigenCoatingType.ANY;
        case 'AntigenCoatingType.NONE': return AntigenCoatingType.NONE;
        default: return null;
// default: throw "Unknown antigenCoating string: " + s;
        }
    };
}

export = S2T;