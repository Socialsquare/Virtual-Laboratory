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
import ApparatusType = require('model/type/Apparatus');
import ApparatusLocationType = require('model/type/ApparatusLocation');

// This is a static helper class to convert string representations of
// types to typescript values, e.g. convert "LiquidType.WATER" to the
// LiquidType.WATER enum value.

class S2T {

    static generic(T, prefix: string, value: string) {
        if (value === undefined)
            return null;

        return T[value.replace(prefix, '')];
    }

    static consequence(s: string) {
        return S2T.generic(ConsequenceType, 'ConsequenceType.', s);
    }

    static apparatus(s: string) {
        return S2T.generic(ApparatusType, 'ApparatusType.', s);
    }

    static apparatusLocation(s: string) {
        return S2T.generic(ApparatusLocationType, 'ApparatusLocationType.', s);
    }

    static mouseBlood(s: string) {
        return S2T.generic(MouseBloodType, 'MouseBloodType.', s);
    }

    static mouse(s: string) {
        return S2T.generic(MouseType, 'MouseType.', s);
    }

    static trigger(s: string) {
        return S2T.generic(TriggerType, 'TriggerType.', s);
    }

    static activation(s: string) {
        return S2T.generic(ActivationType, 'ActivationType.', s);
    }

    static container(s: string) {
        return S2T.generic(ContainerType, 'ContainerType.', s);
    }

    static liquid(s: string) {
        return S2T.generic(LiquidType, 'LiquidType.', s);
    }

    static microorganism(s: string) {
        return S2T.generic(MicroorganismType, 'MicroorganismType.', s);
    }

    static antibiotic(s: string) {
        return S2T.generic(AntibioticType, 'AntibioticType.', s);
    }

    static loc(s: string) {
        return S2T.generic(LocationType, 'LocationType.', s);
    }

    static antigenCoating(s: string) {
        return S2T.generic(AntigenCoatingType, 'AntigenCoatingType.', s);
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
        return S2T.generic(ProteinCodingSequenceType, 'ProteinCodingSequenceType.', s);
    }
}

export = S2T;
