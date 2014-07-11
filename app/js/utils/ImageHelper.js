define([
    'model/ContainerType',
    'model/LiquidType'
], function (ContainerType, LiquidType) {
    var IMG_PATH = 'assets/images';

    return {
        incubatorTubeRackImage: function (position, tube) {
            if (!tube) return '';

            return IMG_PATH + '/incubator_tube' + (position + 1) + '.png';
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

        tableSpacePetriImage: function (dish) {
            if (!dish) return '';

            var state = dish.isEmpty() ? 'empty' : 'full';
            return IMG_PATH + '/petri_' + state + '.png';
        },

        tableSpaceMicroImage: function (position, dish) {
            if (!dish) return '';

            return IMG_PATH + '/micro' + (position + 1) + '.png';
        },

        inventoryIcon: function (item) {
            switch (item.type()) {
            case ContainerType.PETRI_DISH:
                return IMG_PATH + '/icon_cup_petri.png';

            case ContainerType.MICROTITER:
                return IMG_PATH + '/icon_cup_mkrt.png';

            case ContainerType.TUBE:
                return IMG_PATH + '/icon_cup_tube.png';

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

            case LiquidType.DNA:
                return IMG_PATH + '/icon_cup_tube.png';

            default:
                throw 'Unknown inventory item: ' + item.type();
            }
        }
    };
});
