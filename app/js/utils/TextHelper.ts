import _ = require('lodash');

import i18n = require('service/Localization');

import ContainerType = require('model/type/Container');
import SpecialItemType = require('model/type/SpecialItem');
import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

import SimpleContainerModel = require('model/SimpleContainer');

class TextHelper {

    static description(item) {
        switch (item.type()) {
        case SpecialItemType.SCALPEL:
            return 'item.description.scalpel';
        case SpecialItemType.SPLEEN:
            return 'item.description.spleen';
        case SpecialItemType.WASH_BOTTLE:
            return 'item.description.wash_bottle';
        case SpecialItemType.BUFFER:
            return 'item.description.buffer';
        case SpecialItemType.MOUSE:
            return 'item.description.scalpel';

        case LiquidType.INSULIN:
            return 'liquid.description.insulin';
        case LiquidType.LIPASE_ENZYME:
            return 'liquid.description.lipase';
        case LiquidType.ANTIBODY_GOUT:
            return 'liquid.description.antibody_gout';
        case LiquidType.ANTIBODY_SMALLPOX:
            return 'liquid.description.antibody_smallpox';

        default:
            throw 'Unknown inventory item: ' + item.type();
        }
    }

    static i18nFromType(type: LiquidType) {
        return i18n.text(TextHelper.prettyNameFromType(type));
    }

    static label(container: SimpleContainerModel) {
        var subtyped = [ LiquidType.MOUSE_BLOOD, LiquidType.ANTIBIOTIC ];

        var contents = _.map(container.liquids(), (l) => {
            if (_.contains(subtyped, l.type())) {
                var type = TextHelper.i18nFromType(l.type());
                var subtype = TextHelper.i18nFromType(l.subtype());
                return type + ' (' + subtype + ')';
            }

            return i18n.text(TextHelper.prettyName(l));
        });

        return i18n.text('common.contains') + ': ' + contents.join(' & ');
    }

    static prettyName(item) {
        return TextHelper.prettyNameFromType(item.type());
    }

    static prettyNameFromType(type: ContainerType | SpecialItemType | LiquidType | MouseBloodType) {
        switch (type) {
        case ContainerType.PETRI_DISH:
            return 'item.name.petri_dish';
        case ContainerType.MICROTITER:
            return 'item.name.microtiter';
        case ContainerType.TUBE:
            return 'item.name.tube';
        case ContainerType.SYRINGE:
            return 'item.name.syringe';

        case SpecialItemType.SCALPEL:
            return 'item.name.scalpel';
        case SpecialItemType.SPLEEN:
            return 'item.name.spleen';
        case SpecialItemType.BUFFER:
            return 'item.name.buffer';
        case SpecialItemType.WASH_BOTTLE:
            return 'item.name.wash_bottle';

        case MouseBloodType.NORMAL:
            return 'liquid.name.mouse_blood.normal';
        case MouseBloodType.DIABETIC:
            return 'liquid.name.mouse_blood.diabetic';

        case LiquidType.MICROTITER_WELLS:
            return 'liquid.name.microtiter_wells';
        case LiquidType.MICROORGANISM:
            return 'liquid.name.microorganism';
        case LiquidType.ANTIBIOTIC:
            return 'liquid.name.antibiotic';
        case LiquidType.GROWTH_MEDIUM:
            return 'liquid.name.growth_medium';
        case LiquidType.HYBRIDOMA_MEDIUM:
            return 'liquid.name.hybridoma_medium';
        case LiquidType.DNA:
            return 'liquid.name.dna';
        case LiquidType.GENE:
            return 'liquid.name.gene';
        case LiquidType.ORGANISM_PROPERTY:
            return 'liquid.name.organism_property';
        case LiquidType.JUICE:
            return 'liquid.name.juice';
        case LiquidType.DEADLY:
            return 'liquid.name.deadly';
        case LiquidType.HOMO_SPLEEN:
            return 'liquid.name.homo_spleen';
        case LiquidType.INSULIN:
            return 'liquid.name.insulin';
        case LiquidType.ANTIBODY_GOUT:
            return 'liquid.name.antibody_gout';
        case LiquidType.ANTIBODY_SMALLPOX:
            return 'liquid.name.antibody_smallpox';
        case LiquidType.ANTIGEN_GOUT:
            return 'liquid.name.antigen_gout';
        case LiquidType.ANTIGEN_SMALLPOX:
            return 'liquid.name.antigen_smallpox';
        case LiquidType.SALT_WATER:
            return 'item.name.salt_water';
        case LiquidType.FLUORESCENT_2ND_ANTIBODY:
            return 'liquid.name.fluorescent_2nd_antibody';
        case LiquidType.ADJUVANS:
            return 'liquid.name.adjuvans';
        case LiquidType.LIPASE_ENZYME:
            return 'liquid.name.lipase_enzyme';
        case LiquidType.GFP:
            return 'liquid.name.gfp';
        case LiquidType.CYP_ENZYME:
            return 'liquid.name.cyp_enzyme';
        case LiquidType.TARGET_RECEPTOR:
            return 'liquid.name.target_receptor';
        case LiquidType.DESIGNED_DRUG:
            return 'liquid.name.designed_drug';
        case LiquidType.PRODUCED_INSULIN:
            return 'liquid.name.produced_insulin';
        case LiquidType.PRODUCED_LIPASE:
            return 'liquid.name.produced_lipase';
        case LiquidType.PRODUCED_ANTIBODY_GOUT:
            return 'liquid.name.produced_antibody_gout';
        case LiquidType.PRODUCED_ANTIBODY_POX:
            return 'liquid.name.produced_antibody_pox';

        case LiquidType.MOUSE_BLOOD:
            return 'liquid.name.mouse_blood';
        case LiquidType.BUFFY_COAT:
            return 'liquid.name.buffy_coat';
        case LiquidType.RED_BLOOD_CELLS:
            return 'liquid.name.red_blood_cells';
        case LiquidType.PLASMA:
            return 'liquid.name.plasma';

        case LiquidType.DIABETES_PRIMER:
            return 'liquid.name.diabetes_primer';
        case LiquidType.NUCLEOTIDES:
            return 'liquid.name.nucleotides';
        case LiquidType.DNA_POLYMERASE:
            return 'liquid.name.dna_polymerase';
        case LiquidType.BLUE_STAIN:
            return 'liquid.name.blue_stain';

        case LiquidType.LYSIS:
            return 'liquid.name.lysis';
        case LiquidType.FREE_FLOATING_DNA:
            return 'liquid.name.free_floating_dna';
        case LiquidType.CLUMPED_CELLS:
            return 'liquid.name.clumped_cells';

        default:
            throw 'TextHelper.prettyNameFromType: Unknown type: ' + type;
        }
    }
}

export = TextHelper;
