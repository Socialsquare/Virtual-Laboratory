define([
    'model/ContainerType'
], function (ContainerType) {
    return {
        tubeRackImage: function (position, tube) {
            if (!tube) return '';

            var state = tube.isEmpty() ? 'empty' : 'full';
            return 'img/worktable1_testtube_' + (position + 1) + '_' + state + '.png';
        },

        inventoryIcon: function (item) {
            switch (item.type()) {
            case ContainerType.PETRI_DISH:
                return 'img/icon_cup_petri.png';

            case ContainerType.MICROTITER:
                return 'img/icon_cup_mkrt.png';

            case ContainerType.TUBE:
                return 'img/icon_cup_tube.png';

            default:
                throw 'Unknown inventory item: ' + item.type();
            }
        }
    };
});
