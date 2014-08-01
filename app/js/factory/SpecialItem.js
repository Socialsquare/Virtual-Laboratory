define([
    'knockout',

    'model/SpecialItem',
    'model/Scalpel',
    'model/Syringe',
    'model/Spleen',

    'model/type/SpecialItem'

], function (ko, SpecialItemModel, Scalpel, Syringe, Spleen, SpecialItemType) {

    var SpecialItem = {
        scalpel: function () {
            return new Scalpel();
        },

        syringe: function () {
            return new Syringe();
        },

        spleen: function () {
            return new Spleen();
        },

        washBottle: function () {
            return new SpecialItemModel(SpecialItemType.WASH_BOTTLE);
        },

        buffer: function() {
            return new SpecialItemModel(SpecialItemType.BUFFER);
        }
    };

    return SpecialItem;
});
