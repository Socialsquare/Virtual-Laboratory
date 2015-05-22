import _ = require('lodash');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import SpecialItemType = require('model/type/SpecialItem');
import LocationType = require('model/type/Location');

import MicrotiterplateModel = require('model/Microtiterplate');

import SimpleContainerModel = require('model/SimpleContainer');

class ImageHelper {

    static imageRoot = 'assets/images';

    static img = (path) => {
        return ImageHelper.imageRoot + '/' + path;
    }

    static emptyFull = (prefix: string) => {
        return (position, container) => {
            var state = !container || container.isEmpty() ? 'empty' : 'full';
            return ImageHelper.img(prefix + (position + 1) + '_' + state + '.png');
        };
    }

    static single = (prefix: string) => {
        return (position: number, container: SimpleContainerModel = null) => {
            return ImageHelper.img(prefix + (position + 1) + '.png');
        };
    }

    static incubatorTubeImage = ImageHelper.emptyFull('incubator_tube');
    static incubatorPetriImage = ImageHelper.emptyFull('incubator_dish');
    static tubeRackImage = ImageHelper.emptyFull('tube');
    static iceBathImage = ImageHelper.emptyFull('tube');

    static heaterTubeImage = ImageHelper.single('work1-heater_');
    static tableSpaceMicroImage = ImageHelper.single('micro');
    static uvTableSpaceMicroImage = ImageHelper.single('uv_micro');
    static sidegroupEmptySlot = ImageHelper.single('scaffold_R');

    static odMachineTubeImage = _.constant(ImageHelper.img('work2_od-on.png'));
    // TODO-PCR
    static pcrMachineTubeImage = ImageHelper.emptyFull('tube');

    static tableSpacePetriImage = (position, petri) => {
        var state = !petri || petri.isEmpty() ? 'empty' : 'full';
        return ImageHelper.img('petri_' + state + '.png');
    }

    static spectroPMMicroSlotImage = () => {
        return ImageHelper.img('spectropm_micro.png');
    }

    static uvTubeRackImage = (position, tube) => {
        var state = tube.isEmpty() ? 'empty' : (tube.isFluorescent() ? 'glow' : 'full');
        return ImageHelper.img('uv_tube' + (position + 1) + '_' + state + '.png');
    }

    static uvTableSpacePetriImage = (position, dish) => {
        var state = !dish || dish.isEmpty() ? 'empty' : (dish.isFluorescent() ? 'glow' : 'full');
        return ImageHelper.img('uv_petri' + (position + 1) + '_' + state + '.png');
    }

    static scaffoldImage = (name) => {
        return ImageHelper.img('scaffold_' + name + '.png');
    }

    static sidegroupImage = (name) => {
        return ImageHelper.img('sidegroup_' + name + '.png');
    }

    static microtiterWell = (index: number, microtiter: MicrotiterplateModel) => {
        if (microtiter.location() === LocationType.UVROOM) {
            if (microtiter.isWellFluorescent(index)) {
                return ImageHelper.img('zoom_mkrt_well_uv_glow.png')
            } else if (microtiter.isEmpty()) {
                return ImageHelper.img('zoom_mkrt_well_uv_empty.png');
            } else {
                return ImageHelper.img('zoom_mkrt_well_uv_full.png')
            }
        }

        if (microtiter.isEmpty()) {
            return ImageHelper.img('zoom_mkrt_well_empty.png');
        } else {
            return ImageHelper.img('zoom_mkrt_well_dense.png');
        }
    }

    static inventoryIcon = (item) => {
        switch (item.type()) {
        case ContainerType.PETRI_DISH:
            return ImageHelper.img('icon_cup_petri.png');

        case ContainerType.MICROTITER:
            return ImageHelper.img('icon_cup_mkrt.png');

        case ContainerType.TUBE:
            return ImageHelper.img('icon_cup_tube.png');

        case ContainerType.SYRINGE:
            return ImageHelper.img('icon_med_inj.png');

        case SpecialItemType.SCALPEL:
            return ImageHelper.img('icon_scalpel.png');

        case SpecialItemType.SPLEEN:
            return ImageHelper.img('icon_spleen.png');

        case SpecialItemType.BUFFER:
            return ImageHelper.img('icon_wash_bottle.png');

        case SpecialItemType.WASH_BOTTLE:
            return ImageHelper.img('icon_wash_bottle.png');

        default:
            throw 'Unknown inventory item: ' + item.type();
        }
    }

    static draggingIcon = (item) => {
        switch (item.type()) {
        case ContainerType.PETRI_DISH:
            return ImageHelper.img('icon_cup_petri.png');

        case ContainerType.MICROTITER:
            return ImageHelper.img('icon_cup_mkrt.png');

        case ContainerType.TUBE:
            return ImageHelper.img('icon_cup_tube.png');

        case ContainerType.BOTTLE:
            return ImageHelper.img('grab_drink.png');

        case LiquidType.DNA:
            return ImageHelper.img('icon_cup_tube.png');

        case ContainerType.SYRINGE:
            return ImageHelper.img('icon_med_inj.png');

        case SpecialItemType.SPLEEN:
            return ImageHelper.img('icon_spleen.png');

        case SpecialItemType.SCALPEL:
            return ImageHelper.img('icon_scalpel.png');

        case SpecialItemType.BUFFER:
            return ImageHelper.img('icon_wash_bottle.png');

        case SpecialItemType.WASH_BOTTLE:
            return ImageHelper.img('icon_wash_bottle.png');

        default:
            throw 'Unknown dragging item: ' + item.type();
        }
    }
}

export = ImageHelper;
