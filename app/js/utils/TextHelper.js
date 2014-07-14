define([
    'model/type/Container',
    'model/type/SpecialItem'
], function (ContainerType, SpecialItemType) {

    return {
        description: function (item) {
            switch (item.type()) {
            case SpecialItemType.SCALPEL:
                return 'Du kan bruge skalpelen til at skære i ting';

            case SpecialItemType.SPLEEN:
                return 'Milten er rød. Messi vinder næste VM.';

            default:
                throw 'Unknown inventory item: ' + item.type();
            }
        },

        prettyName: function (item) {
            switch (item.type()) {
            case ContainerType.PETRI_DISH:
                return 'Petriskål';

            case ContainerType.MICROTITER:
                return 'Microtiterbakke';

            case ContainerType.TUBE:
                return 'Reagensglas';

            case ContainerType.SYRINGE:
                return 'Kanyle';

            case SpecialItemType.SCALPEL:
                return 'Skalpel';

            case SpecialItemType.SPLEEN:
                return 'Milt';

            default:
                throw 'Unknown inventory item: ' + item.type();
            }
        }
    };
});
