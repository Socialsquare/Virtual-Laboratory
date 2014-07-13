define([
    'model/type/Container',
    'model/type/Liquid',
    'model/type/SpecialItem'
], function (ContainerType, LiquidType, SpecialItemType) {
    var IMG_PATH = 'assets/images';

    return {
        incubatorTubeRackImage: function (position, tube) {
            if (!tube) return '';

            return IMG_PATH + '/incubator_tube' + (position + 1) + '.png';
        },

        incubatorPetriImage: function (position, dish) {
            if (!dish) return '';

            return IMG_PATH + '/incubator_dish' + (position + 1) + '.png';
        },

        incubatorPetriPlaceholderImage: function (position, dish) {
            return IMG_PATH + '/incubator_dish' + (position + 1) + '_placeholder.png';
        },

        tubeRackImage: function (position, tube) {
            if (!tube) return '';

            var state = tube.isEmpty() ? 'empty' : 'full';
            return IMG_PATH + '/worktable1_testtube_' + (position + 1) + '_' + state + '.png';
        },

        heaterTubeImage: function (position, tube) {
            if (!tube) return '';

            return IMG_PATH + '/work1-heater_' + (position + 1) + '.png';
        },

        tableSpacePetriImage: function (position, dish) {
            if (!dish) return '';

            var state = dish.isEmpty() ? 'empty' : 'full';
            return IMG_PATH + '/petri_' + state + '.png';
        },

        tableSpacePetriPlaceholderImage: function (position) {
            return IMG_PATH + '/petri_placeholder.png';
        },

        tableSpaceMicroPlaceholderImage: function (position) {
            return IMG_PATH + '/micro' + (position + 1) + '_placeholder.png';
        },

        tableSpaceMicroImage: function (position, plate) {
            if (!plate) return '';

            return IMG_PATH + '/micro' + (position + 1) + '.png';
        },

        odMachineTubeImage: function (position, tube) {
            return IMG_PATH + '/work2_od-on.png';
        },

        inventoryIcon: function (item) {
            switch (item.type()) {
            case ContainerType.PETRI_DISH:
                return IMG_PATH + '/icon_cup_petri.png';

            case ContainerType.MICROTITER:
                return IMG_PATH + '/icon_cup_mkrt.png';

            case ContainerType.TUBE:
                return IMG_PATH + '/icon_cup_tube.png';

            case SpecialItemType.SYRINGE:
                return IMG_PATH + '/icon_med_inj.png';

            case SpecialItemType.SCALPEL:
                return IMG_PATH + '/icon_scalpel.png';

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

            case SpecialItemType.SYRINGE:
                return IMG_PATH + '/icon_med_inj.png';

            case SpecialItemType.SCALPEL:
                return IMG_PATH + '/icon_scalpel.png';

            default:
                throw 'Unknown dragging item: ' + item.type();
            }
        }
    };
});
