define([
    'model/type/Container',
    'model/type/Liquid',
    'model/type/SpecialItem'

], function (ContainerType, LiquidType, SpecialItemType) {
    var IMG_PATH = 'assets/images';

    return {
        incubatorTubeRackImage: function (position, tube) {
            if (!tube) return '';

            var state = tube.isEmpty() ? '_empty' : '';
            return IMG_PATH + '/incubator_tube' + (position + 1) + state + '.png';
        },

        incubatorPetriImage: function (position, dish) {
            if (!dish) return '';

            var state = dish.isEmpty() ? '_empty' : '';
            return IMG_PATH + '/incubator_dish' + (position + 1) + state + '.png';
        },

        incubatorPetriPlaceholderImage: function (position, dish) {
            return IMG_PATH + '/incubator_dish' + (position + 1) + '_placeholder.png';
        },

        tubeRackImage: function (position, tube) {
            if (!tube) return '';

            var state = tube.isEmpty() ? 'empty' : 'full';
            return IMG_PATH + '/tube' + (position + 1) + '_' + state + '.png';
        },

        heaterTubeImage: function (position, tube) {
            if (!tube) return '';

            return IMG_PATH + '/work1-heater_' + (position + 1) + '.png';
        },

        uvTubeRackImage: function (position, tube) {
            if (!tube) return '';

            var state = tube.isEmpty() ? 'empty' : (tube.isFluorescent() ? 'glow' : 'full');
            return IMG_PATH + '/uv_tube' + (position + 1) + '_' + state + '.png';
        },

        tableSpacePetriImage: function (position, dish) {
            if (!dish) return '';

            var state = dish.isEmpty() ? 'empty' : 'full';
            return IMG_PATH + '/petri_' + state + '.png';
        },

        tableSpacePetriPlaceholderImage: function (position) {
            return IMG_PATH + '/petri_placeholder.png';
        },

        uvTableSpacePetriImage: function (position, dish) {
            if (!dish) return '';

            var state = dish.isEmpty() ? 'empty' : (dish.isFluorescent() ? 'glow' : 'full');
            return IMG_PATH + '/uv_petri' + (position + 1) + '_' + state + '.png';
        },

        tableSpaceMicroImage: function (position, plate) {
            if (!plate) return '';

            return IMG_PATH + '/micro' + (position + 1) + '.png';
        },

        tableSpaceMicroPlaceholderImage: function (position) {
            return IMG_PATH + '/micro' + (position + 1) + '_placeholder.png';
        },

        uvTableSpaceMicroImage: function (position, plate) {
            if (!plate) return '';

            return IMG_PATH + '/uv_micro' + (position + 1) + '.png';
        },

        odMachineTubeImage: function (position, tube) {
            return IMG_PATH + '/work2_od-on.png';
        },

        scaffoldImage: function (name) {
            return IMG_PATH + '/scaffold_' + name + '.png';
        },

        sidegroupImage: function (name) {
            return IMG_PATH + '/sidegroup_' + name + '.png';
        },

        sidegroupEmptySlot: function (position) {
            return IMG_PATH + '/scaffold_R' + (position + 1) + '.png';
        },

        inventoryIcon: function (item) {
            switch (item.type()) {
            case ContainerType.PETRI_DISH:
                return IMG_PATH + '/icon_cup_petri.png';

            case ContainerType.MICROTITER:
                return IMG_PATH + '/icon_cup_mkrt.png';

            case ContainerType.TUBE:
                return IMG_PATH + '/icon_cup_tube.png';

            case ContainerType.SYRINGE:
                return IMG_PATH + '/icon_med_inj.png';

            case SpecialItemType.SCALPEL:
                return IMG_PATH + '/icon_scalpel.png';

            case SpecialItemType.SPLEEN:
                return IMG_PATH + '/icon_spleen.png';

            case SpecialItemType.WASH_BOTTLE:
                return IMG_PATH + '/icon_wash_bottle.png';

            default:
                throw 'Unknown inventory item: ' + item.type();
            }
        },

        draggingIcon: function (item) {
            switch (item.type()) {
            case ContainerType.PETRI_DISH:
                return IMG_PATH + '/icon_cup_petri.png';

            case ContainerType.MICROTITER:
                return IMG_PATH + '/icon_cup_mkrt.png';

            case ContainerType.TUBE:
                return IMG_PATH + '/icon_cup_tube.png';

            case ContainerType.BOTTLE:
                return IMG_PATH + '/grab_drink.png';

            case LiquidType.DNA:
                return IMG_PATH + '/icon_cup_tube.png';

            case ContainerType.SYRINGE:
                return IMG_PATH + '/icon_med_inj.png';

            case SpecialItemType.SPLEEN:
                return IMG_PATH + '/icon_spleen.png';

            case SpecialItemType.SCALPEL:
                return IMG_PATH + '/icon_scalpel.png';

            case SpecialItemType.WASH_BOTTLE:
                return IMG_PATH + '/icon_wash_bottle.png';

            default:
                throw 'Unknown dragging item: ' + item.type();
            }
        }
    };
});
