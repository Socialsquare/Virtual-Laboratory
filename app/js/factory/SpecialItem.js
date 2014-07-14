define([
    'knockout',
    'model/Scalpel',
    'model/Syringe',
    'model/Spleen'

], function (ko, Scalpel, Syringe, Spleen) {

    var SpecialItem = {
        scalpel: function () {
            return new Scalpel();
        },

        syringe: function () {
            return new Syringe();
        },

        spleen: function () {
            return new Spleen();
        }
    };

    return SpecialItem;
});
