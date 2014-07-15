define([
    'model/type/Container',
    'model/type/SpecialItem',
    'service/Localization'
], function (ContainerType, SpecialItemType, localizationService) {

    return {
        description: function (item) {
            switch (item.type()) {
            case SpecialItemType.SCALPEL:
                return 'item.description.scalpel';

            case SpecialItemType.SPLEEN:
                return 'item.description.spleen';

            default:
                throw 'Unknown inventory item: ' + item.type();
            }
        },

        prettyName: function (item) {
            switch (item.type()) {
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

            default:
                throw 'Unknown inventory item: ' + item.type();
            }
        }
    };
});
