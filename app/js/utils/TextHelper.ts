import _ = require('lodash');

import localizationService = require('service/Localization');

import ContainerType = require('model/type/Container');
import SpecialItemType = require('model/type/SpecialItem');
import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

import LiquidModel = require('model/Liquid');
import SimpleContainerModel = require('model/SimpleContainer');

class TextHelper {

    static description = (item) => {
        switch (item.type()) {
        case SpecialItemType.SCALPEL:
            return 'item.description.scalpel';
        case SpecialItemType.SPLEEN:
            return 'item.description.spleen';
        case SpecialItemType.WASH_BOTTLE:
            return 'item.description.wash_bottle';
        case SpecialItemType.BUFFER:
            return 'item.description.buffer';

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

    static label = (container: SimpleContainerModel) => {
        var contents = _.map(container.liquids(), (l) => {
            if (l.type() == LiquidType.MOUSE_BLOOD) {
                var blood = localizationService.text(TextHelper.prettyNameFromType(l.type()));
                var type = localizationService.text(TextHelper.prettyNameFromType(l.subtype()));
                return blood + ' (' + type + ')';
            }

            return localizationService.text(TextHelper.prettyName(l))
        });

        return localizationService.text('common.contains') + ': ' + contents.join(' & ');
    }

    // static mouseBlood = (liquid: LiquidModel) => {
    //     var blood = localizationService.text(TextHelper.prettyNameFromType(item.type()));
    //     var type = localizationService.text(TextHelper.prettyNameFromType(item.subtype()));
    //     return blood + ' (' + type + ')';
    // }

    static prettyName = (item) => {
        return TextHelper.prettyNameFromType(item.type());
    }

    static prettyNameFromType = (type: ContainerType | SpecialItemType | LiquidType | MouseBloodType) => {
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

        default:
            throw 'TextHelper.prettyNameFromType: Unknown type: ' + type;
        }
    }
}

export = TextHelper;
